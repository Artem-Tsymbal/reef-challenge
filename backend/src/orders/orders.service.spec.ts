import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Repository, Between, Like } from 'typeorm';
import { Order } from './entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';

describe('OrdersService', () => {
	let service: OrdersService;
	let ordersRepository: Repository<Order>;
	let productsService: Partial<ProductsService>;
	let notificationsGateway: Partial<NotificationsGateway>;

	beforeEach(async () => {
		productsService = {
			findOne: jest.fn(),
		};

		notificationsGateway = {
			sendOrderNotification: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OrdersService,
				{
					provide: getRepositoryToken(Order),
					useClass: Repository,
				},
				{
					provide: ProductsService,
					useValue: productsService,
				},
				{
					provide: NotificationsGateway,
					useValue: notificationsGateway,
				},
			],
		}).compile();

		service = module.get<OrdersService>(OrdersService);
		ordersRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('should create and return an order', async () => {
			const createOrderInput = {
				customerName: 'John Doe',
				orderDate: new Date(),
				status: 'Pending',
				orderItems: [{ productId: 1, quantity: 2, price: 9.99 }],
			};

			const product = { id: 1, name: 'Product 1', description: 'Desc', price: 9.99 };
			jest.spyOn(productsService, 'findOne').mockResolvedValue(product as any);

			const order = new Order();
			order.id = 1;
			order.customerName = createOrderInput.customerName;
			order.orderDate = createOrderInput.orderDate;
			order.status = createOrderInput.status;
			order.orderItems = [
				{
					id: 1,
					product: product,
					quantity: 2,
					price: 9.99,
					order: order,
				} as OrderItem,
			];

			jest.spyOn(ordersRepository, 'save').mockResolvedValue(order);

			const result = await service.create(createOrderInput);

			expect(productsService.findOne).toHaveBeenCalledWith(1);
			expect(ordersRepository.save).toHaveBeenCalled();
			expect(result).toEqual(order);
		});
	});

	describe('findAll', () => {
		it('should return all orders', async () => {
			const orders = [
				{
					id: 1,
					customerName: 'John Doe',
					orderDate: new Date(),
					status: 'Pending',
					orderItems: [],
				},
			];

			jest.spyOn(ordersRepository, 'find').mockResolvedValue(orders as any);

			const result = await service.findAll();

			expect(ordersRepository.find).toHaveBeenCalledWith({ relations: ['orderItems', 'orderItems.product'] });
			expect(result).toEqual(orders);
		});

		it('should return filtered orders when search term is provided', async () => {
			const search = 'John';
			const orders = [
				{
					id: 1,
					customerName: 'John Doe',
					orderDate: new Date(),
					status: 'Pending',
					orderItems: [],
				},
			];

			jest.spyOn(ordersRepository, 'find').mockResolvedValue(orders as any);

			const result = await service.findAll(search);

			expect(ordersRepository.find).toHaveBeenCalledWith({
				where: { customerName: Like(`%${search}%`) },
				relations: ['orderItems', 'orderItems.product'],
			});
			expect(result).toEqual(orders);
		});
	});

	describe('findOne', () => {
		it('should return an order by ID', async () => {
			const order = {
				id: 1,
				customerName: 'John Doe',
				orderDate: new Date(),
				status: 'Pending',
				orderItems: [],
			};

			jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(order as any);

			const result = await service.findOne(1);

			expect(ordersRepository.findOne).toHaveBeenCalledWith({
				where: { id: 1 },
				relations: ['orderItems', 'orderItems.product'],
			});
			expect(result).toEqual(order);
		});
	});

	describe('updateStatus', () => {
		it('should update the status of an order', async () => {
			const orderId = 1;
			const newStatus = 'Shipped';
			const updatedOrder = {
				id: orderId,
				status: newStatus,
			};

			jest.spyOn(ordersRepository, 'update').mockResolvedValue(undefined);
			jest.spyOn(service, 'findOne').mockResolvedValue(updatedOrder as any);

			const result = await service.updateStatus(orderId, newStatus);

			expect(ordersRepository.update).toHaveBeenCalledWith(orderId, { status: newStatus });
			expect(service.findOne).toHaveBeenCalledWith(orderId);
			expect(result).toEqual(updatedOrder);
		});
	});

	it('should return sales report', async () => {
		const orders = [
			{
				id: 1,
				orderDate: new Date('2023-01-15'),
				orderItems: [{ price: 10, quantity: 2 }],
			},
			{
				id: 2,
				orderDate: new Date('2023-02-20'),
				orderItems: [{ price: 15, quantity: 1 }],
			},
		];

		jest.spyOn(ordersRepository, 'find').mockResolvedValue(orders as any);

		const result = await service.getSalesReport('2023-01-01', '2023-12-31');

		expect(ordersRepository.find).toHaveBeenCalledWith({
			where: { orderDate: Between(new Date('2023-01-01'), new Date('2023-12-31')) },
			relations: ['orderItems'],
		});

		const totalSales = 10 * 2 + 15 * 1;
		const numberOfOrders = 2;
		const averageOrderValue = totalSales / numberOfOrders;

		const expectedReport = {
			totalSales,
			numberOfOrders,
			averageOrderValue,
			salesOverTime: [
				{ date: '2023-01-15', sales: 20, orders: 1 },
				{ date: '2023-02-20', sales: 15, orders: 1 },
			],
		};

		expect(result).toEqual(expectedReport);
	});
});
