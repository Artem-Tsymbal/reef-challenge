import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	firstName: string;

	@IsOptional()
	@IsString()
	lastName: string;

	@IsOptional()
	@IsString()
	@IsEmail()
	email: string;

	@IsOptional()
	@IsString()
	telegramUsername: string;

	@IsOptional()
	@IsString()
	telegramUserId: string;

	@IsOptional()
	@IsString()
	phoneNumber: string;
}
