import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './models/product.model';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';

@Resolver(() => Product)
export class ProductsResolver {
	constructor(private readonly productsService: ProductsService) {}

	@UseGuards(GraphqlJwtAuthGuard)
	@Mutation(() => Product)
	createProduct(@Args('createProductInput') createProductInput: CreateProductInput) {
		return this.productsService.create(createProductInput);
	}

	@Query(() => [Product], { name: 'products' })
	findAll(@Args('search', { type: () => String, nullable: true }) search?: string) {
		return this.productsService.findAll(search);
	}

	@Query(() => Product, { name: 'product' })
	findOne(@Args('id', { type: () => Int }) id: number) {
		return this.productsService.findOne(id);
	}

	@UseGuards(GraphqlJwtAuthGuard)
	@Mutation(() => Product)
	updateProduct(@Args('updateProductInput') updateProductInput: UpdateProductInput): Promise<Product> {
		return this.productsService.update(updateProductInput.id, updateProductInput);
	}

	@UseGuards(GraphqlJwtAuthGuard)
	@Mutation(() => Boolean)
	async removeProduct(@Args('id', { type: () => Int }) id: number) {
		await this.productsService.remove(id);
		return true;
	}
}
