import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './models/order.model';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { SalesReport } from './models/sales-report.model';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';
import { ProductsService } from 'src/products/products.service';

@Resolver(() => Order)
export class OrdersResolver {
	constructor(private readonly ordersService: OrdersService, private productsService: ProductsService) {}

	@UseGuards(GraphqlJwtAuthGuard)
	@Mutation(() => Order)
	createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
		return this.ordersService.create(createOrderInput);
	}

	@UseGuards(GraphqlJwtAuthGuard)
	@Mutation(() => Order)
	async createRandomOrder(): Promise<Order> {
		const randomProducts = await this.productsService.getRandomProducts(3);
		const orderItems = randomProducts.map((product) => ({
			productId: product.id,
			quantity: Math.floor(Math.random() * 3) + 1,
			price: product.price,
		}));

		const createOrderInput: CreateOrderInput = {
			customerName: `Random Customer ${Math.floor(Math.random() * 3)}`,
			orderDate: new Date(),
			status: 'Pending',
			orderItems,
		};

		return this.ordersService.create(createOrderInput);
	}

	@UseGuards(GraphqlJwtAuthGuard)
	@Query(() => [Order], { name: 'orders' })
	findAll(@Args('search', { type: () => String, nullable: true }) search?: string) {
		return this.ordersService.findAll(search);
	}

	@UseGuards(GraphqlJwtAuthGuard)
	@Query(() => Order, { name: 'order' })
	findOne(@Args('id', { type: () => Int }) id: number) {
		return this.ordersService.findOne(id);
	}

	@UseGuards(GraphqlJwtAuthGuard)
	@Mutation(() => Order)
	updateOrderStatus(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
		return this.ordersService.updateStatus(updateOrderInput.id, updateOrderInput.status);
	}

	@UseGuards(GraphqlJwtAuthGuard)
	@Query(() => SalesReport)
	async salesReport(
		@Args('startDate', { type: () => String, nullable: true }) startDate?: string,
		@Args('endDate', { type: () => String, nullable: true }) endDate?: string,
	): Promise<SalesReport> {
		return this.ordersService.getSalesReport(startDate, endDate);
	}
}
