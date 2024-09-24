import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Product } from '../../products/models/product.model';

@ObjectType()
export class OrderItem {
	@Field(() => ID)
	id: number;

	@Field(() => Product!)
	product: Product;

	@Field(() => Int)
	quantity: number;

	@Field(() => Float)
	price: number;
}
