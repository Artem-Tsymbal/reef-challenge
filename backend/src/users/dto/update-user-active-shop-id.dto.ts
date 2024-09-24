import { IsNumber, IsOptional } from 'class-validator';

export class UpdateUserActiveShopIdDto {
	@IsOptional()
	@IsNumber()
	activeShopId: number;
}
