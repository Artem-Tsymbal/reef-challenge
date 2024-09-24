import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductsService', () => {
	let service: ProductsService;
	let repository: Repository<Product>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProductsService,
				{
					provide: getRepositoryToken(Product),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<ProductsService>(ProductsService);
		repository = module.get<Repository<Product>>(getRepositoryToken(Product));
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('should create and return a product', async () => {
			const createProductData = {
				name: 'Test Product',
				description: 'Test Description',
				price: 10.99,
				imageUrl: 'http://example.com/image.png',
			};

			const savedProduct = { id: 1, ...createProductData };

			jest.spyOn(repository, 'create').mockReturnValue(savedProduct as any);
			jest.spyOn(repository, 'save').mockResolvedValue(savedProduct as any);

			const result = await service.create(createProductData);

			expect(repository.create).toHaveBeenCalledWith(createProductData);
			expect(repository.save).toHaveBeenCalledWith(savedProduct);
			expect(result).toEqual(savedProduct);
		});
	});

	describe('findAll', () => {
		it('should return an array of products', async () => {
			const products = [
				{ id: 1, name: 'Product 1', description: 'Desc 1', price: 9.99, imageUrl: null },
				{ id: 2, name: 'Product 2', description: 'Desc 2', price: 19.99, imageUrl: null },
			];

			jest.spyOn(repository, 'find').mockResolvedValue(products as any);

			const result = await service.findAll();

			expect(repository.find).toHaveBeenCalled();
			expect(result).toEqual(products);
		});

		it('should return filtered products when search term is provided', async () => {
			const search = 'Product';
			const products = [{ id: 1, name: 'Product 1', description: 'Desc 1', price: 9.99, imageUrl: null }];

			jest.spyOn(repository, 'find').mockResolvedValue(products as any);

			const result = await service.findAll(search);

			expect(repository.find).toHaveBeenCalledWith({
				where: [{ name: Like(`%${search}%`) }, { description: Like(`%${search}%`) }],
			});
			expect(result).toEqual(products);
		});
	});

	describe('findOne', () => {
		it('should return a product by ID', async () => {
			const product = { id: 1, name: 'Product 1', description: 'Desc 1', price: 9.99, imageUrl: null };

			jest.spyOn(repository, 'findOne').mockResolvedValue(product as any);

			const result = await service.findOne(1);

			expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
			expect(result).toEqual(product);
		});
	});

	describe('update', () => {
		it('should update a product and return the updated product', async () => {
			const updateData = {
				id: 1,
				name: 'Updated Product',
				description: 'Updated Description',
				price: 19.99,
				imageUrl: 'http://example.com/updated-image.png',
			};
			const updatedProduct = { id: 1, ...updateData };

			jest.spyOn(repository, 'update').mockResolvedValue(undefined);
			jest.spyOn(repository, 'findOne').mockResolvedValue(updatedProduct as any);

			const result = await service.update(1, updateData);

			expect(repository.update).toHaveBeenCalledWith(1, updateData);
			expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
			expect(result).toEqual(updatedProduct);
		});
	});

	describe('remove', () => {
		it('should delete a product', async () => {
			jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

			await service.remove(1);

			expect(repository.delete).toHaveBeenCalledWith(1);
		});
	});
});
