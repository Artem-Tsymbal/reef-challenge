import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1630000000001 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.startTransaction();
		try {
			await queryRunner.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    "firstName" VARCHAR(255) NOT NULL,
                    "lastName" VARCHAR(255) NOT NULL,
                    "refreshToken" VARCHAR(255)
                );
            `);

			await queryRunner.query(`
                CREATE TABLE products (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT NOT NULL,
                    price DECIMAL NOT NULL,
                    "imageUrl" VARCHAR(255)
                );
            `);

			await queryRunner.query(`
                CREATE TABLE orders (
                    id SERIAL PRIMARY KEY,
                    "customerName" VARCHAR(255) NOT NULL,
                    "orderDate" TIMESTAMP NOT NULL,
                    status VARCHAR(255) NOT NULL
                );
            `);

			await queryRunner.query(`
                CREATE TABLE order_items (
                    id SERIAL PRIMARY KEY,
                    "orderId" INT NOT NULL,
                    "productId" INT NOT NULL,
                    quantity INT NOT NULL,
                    price DECIMAL NOT NULL,
                    CONSTRAINT fk_order FOREIGN KEY ("orderId") REFERENCES orders(id) ON DELETE CASCADE,
                    CONSTRAINT fk_product FOREIGN KEY ("productId") REFERENCES products(id)
                );
            `);

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.startTransaction();
		try {
			await queryRunner.query(`DROP TABLE order_items`);
			await queryRunner.query(`DROP TABLE orders`);
			await queryRunner.query(`DROP TABLE products`);
			await queryRunner.query(`DROP TABLE users`);

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		}
	}
}
