import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateOrderInput {
	@Field(() => Int)
	@IsNotEmpty()
	id: number;

	@Field()
	@IsNotEmpty()
	status: string;
}
