import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedProducts1630000000002 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.startTransaction();
		try {
			await queryRunner.query(`
                INSERT INTO products (name, description, price, "imageUrl")
                VALUES
                    ('Product 1', 'Description 1', 10, 'https://cataas.com/cat'),
                    ('Product 2', 'Description 2', 20, NULL),
                    ('Product 3', 'Description 3', 30, 'https://cataas.com/cat'),
                    ('Product 4', 'Description 4', 40, 'https://cataas.com/cat'),
                    ('Product 5', 'Description 5', 50, 'https://cataas.com/cat');
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
			await queryRunner.query(`
                DELETE FROM products WHERE name IN ('Product 1', 'Product 2', 'Product 3', 'Product 4', 'Product 5');
            `);

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		}
	}
}
