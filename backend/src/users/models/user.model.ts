import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
	@Field(() => ID)
	id: number;

	@Field()
	email: string;

	@Field()
	firstName: string;

	@Field()
	lastName: string;
}
