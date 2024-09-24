import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class UpdateProductInput {
	@Field(() => Int)
	@IsNotEmpty()
	id: number;

	@Field()
	@IsNotEmpty()
	name: string;

	@Field()
	@IsNotEmpty()
	description: string;

	@Field(() => Float)
	@IsNotEmpty()
	price: number;

	@Field({ nullable: true })
	@IsOptional()
	imageUrl?: string;
}
