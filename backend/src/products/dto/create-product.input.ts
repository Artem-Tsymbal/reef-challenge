import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateProductInput {
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
