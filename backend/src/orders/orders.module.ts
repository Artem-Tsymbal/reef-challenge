import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { ProductsModule } from '../products/products.module';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Module({
	imports: [TypeOrmModule.forFeature([Order, OrderItem]), ProductsModule],
	providers: [OrdersService, OrdersResolver, NotificationsGateway],
	exports: [OrdersService],
})
export class OrdersModule {}
