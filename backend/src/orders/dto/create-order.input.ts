import { IsNotEmpty, IsDate, IsString, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';
import { OrderItemInput } from '../../order-items/dto/order-item.input';

@InputType()
export class CreateOrderInput {
	@Field()
	@IsNotEmpty()
	@IsString()
	customerName: string;

	@Field()
	@IsNotEmpty()
	@IsDate()
	orderDate: Date;

	@Field()
	@IsNotEmpty()
	@IsString()
	status: string;

	@Field(() => [OrderItemInput])
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => OrderItemInput)
	orderItems: OrderItemInput[];
}
