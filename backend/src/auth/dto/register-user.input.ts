import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterUserInput {
	@Field()
	@IsEmail()
	email: string;

	@Field()
	@IsString()
	firstName: string;

	@Field()
	@IsString()
	lastName: string;

	@Field()
	@IsString()
	@MinLength(6)
	password: string;
}
