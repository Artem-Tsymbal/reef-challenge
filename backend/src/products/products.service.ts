import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository, Like } from 'typeorm';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable()
export class ProductsService {
	constructor(
		@InjectRepository(Product)
		private productsRepository: Repository<Product>,
	) {}

	create(productData: Partial<Product>): Promise<Product> {
		const product = this.productsRepository.create(productData);
		return this.productsRepository.save(product);
	}

	findAll(search?: string): Promise<Product[]> {
		if (search) {
			return this.productsRepository.find({
				where: [{ name: Like(`%${search}%`) }, { description: Like(`%${search}%`) }],
			});
		}
		return this.productsRepository.find();
	}

	findOne(id: number): Promise<Product> {
		return this.productsRepository.findOne({ where: { id } });
	}

	async update(id: number, updateProductInput: UpdateProductInput): Promise<Product> {
		const product = await this.productsRepository.findOne({ where: { id } });

		if (!product) {
			throw new Error('Product not found');
		}

		await this.productsRepository.update(id, updateProductInput);
		return this.productsRepository.findOne({ where: { id } });
	}

	async remove(id: number): Promise<void> {
		await this.productsRepository.delete(id);
	}

	async getRandomProducts(count: number): Promise<Product[]> {
		const products = await this.productsRepository.find();
		return products.sort(() => 0.5 - Math.random()).slice(0, count);
	}
}
