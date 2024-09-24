import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderItem } from '../../order-items/entities/order-item.entity';

@Entity('orders')
export class Order {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	customerName: string;

	@Column('timestamp')
	orderDate: Date;

	@Column()
	status: string;

	@OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
	orderItems: OrderItem[];
}
