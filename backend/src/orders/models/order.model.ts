import { ObjectType, Field, ID } from '@nestjs/graphql';
import { OrderItem } from '../../order-items/models/order-item.model';

@ObjectType()
export class Order {
	@Field(() => ID)
	id: number;

	@Field()
	customerName: string;

	@Field()
	orderDate: Date;

	@Field()
	status: string;

	@Field(() => [OrderItem])
	orderItems: OrderItem[];
}
