import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class Product {
	@Field(() => ID)
	id: number;

	@Field()
	name: string;

	@Field()
	description: string;

	@Field(() => Float)
	price: number;

	@Field({ nullable: true })
	imageUrl?: string;
}
