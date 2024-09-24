import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';

@Module({
	imports: [TypeOrmModule.forFeature([OrderItem])],
	providers: [],
	exports: [],
})
export class OrderItemsModule {}
