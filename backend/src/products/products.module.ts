import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';

@Module({
	imports: [TypeOrmModule.forFeature([Product])],
	providers: [ProductsService, ProductsResolver],
	exports: [ProductsService],
})
export class ProductsModule {}
