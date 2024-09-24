import { Injectable } from '@nestjs/common';
import { Repository, Between, Like } from 'typeorm';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SalesReport } from './models/sales-report.model';
import { ProductsService } from '../products/products.service';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class OrdersService {
	constructor(
		@InjectRepository(Order)
		private ordersRepository: Repository<Order>,
		private productsService: ProductsService,
		private readonly notificationsGateway: NotificationsGateway,
	) {}

	async create(createOrderInput: CreateOrderInput): Promise<Order> {
		const { customerName, orderDate, status, orderItems } = createOrderInput;

		const order = new Order();
		order.customerName = customerName;
		order.orderDate = orderDate;
		order.status = status;

		order.orderItems = await Promise.all(
			orderItems.map(async (itemInput) => {
				const product = await this.productsService.findOne(itemInput.productId);

				if (!product) {
					throw new Error(`Product with ID ${itemInput.productId} not found`);
				}

				const orderItem = new OrderItem();
				orderItem.product = product;
				orderItem.quantity = itemInput.quantity;
				orderItem.price = itemInput.price;
				orderItem.order = order;

				return orderItem;
			}),
		);

		this.notificationsGateway.sendOrderNotification('New order has been placed!');

		return this.ordersRepository.save(order);
	}

	findOne(id: number): Promise<Order> {
		return this.ordersRepository.findOne({
			where: { id },
			relations: ['orderItems', 'orderItems.product'],
		});
	}

	findAll(search?: string): Promise<Order[]> {
		if (search) {
			return this.ordersRepository.find({
				where: { customerName: Like(`%${search}%`) },
				relations: ['orderItems', 'orderItems.product'],
			});
		}
		return this.ordersRepository.find({ relations: ['orderItems', 'orderItems.product'] });
	}

	async updateStatus(id: number, status: string): Promise<Order> {
		await this.ordersRepository.update(id, { status });
		return this.findOne(id);
	}

	async getSalesReport(startDate?: string, endDate?: string): Promise<SalesReport> {
		const where: any = {};
		if (startDate && endDate) {
			where.orderDate = Between(new Date(startDate), new Date(endDate));
		} else if (startDate) {
			where.orderDate = Between(new Date(startDate), new Date());
		}

		const orders = await this.ordersRepository.find({ where, relations: ['orderItems'] });

		const totalSales = orders.reduce((sum, order) => {
			const orderTotal = order.orderItems.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
			return sum + orderTotal;
		}, 0);

		const numberOfOrders = orders.length;
		const averageOrderValue = numberOfOrders > 0 ? totalSales / numberOfOrders : 0;

		const salesOverTime = orders.reduce((acc, order) => {
			const date = order.orderDate.toISOString().split('T')[0];
			const orderTotal = order.orderItems.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);

			if (!acc[date]) {
				acc[date] = { sales: 0, orders: 0 };
			}
			acc[date].sales += orderTotal;
			acc[date].orders += 1;

			return acc;
		}, {});

		const salesOverTimeArray = Object.keys(salesOverTime).map((date) => ({
			date,
			sales: salesOverTime[date].sales,
			orders: salesOverTime[date].orders,
		}));

		return {
			totalSales,
			numberOfOrders,
			averageOrderValue,
			salesOverTime: salesOverTimeArray,
		};
	}
}
