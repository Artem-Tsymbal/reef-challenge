import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({ nullable: true })
	refreshToken: string;
}
