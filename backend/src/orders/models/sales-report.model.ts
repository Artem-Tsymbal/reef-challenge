import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class SalesReport {
	@Field(() => Float)
	totalSales: number;

	@Field(() => Int)
	numberOfOrders: number;

	@Field(() => Float)
	averageOrderValue: number;

	@Field(() => [SalesOverTime], { nullable: true })
	salesOverTime?: SalesOverTime[];
}

@ObjectType()
export class SalesOverTime {
	@Field(() => String)
	date: string;

	@Field(() => Float)
	sales: number;

	@Field(() => Int)
	orders: number;
}
