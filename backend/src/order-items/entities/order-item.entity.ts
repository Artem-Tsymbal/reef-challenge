import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
	order: Order;

	@ManyToOne(() => Product)
	product: Product;

	@Column()
	quantity: number;

	@Column('decimal')
	price: number;
}
