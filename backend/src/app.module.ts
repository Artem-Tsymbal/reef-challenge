import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { NotificationsGateway } from './notifications/notifications.gateway';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				type: 'postgres',
				host: config.get<string>('TYPEORM_HOST'),
				port: config.get<number>('TYPEORM_PORT'),
				username: config.get<string>('TYPEORM_USERNAME'),
				password: config.get<string>('TYPEORM_PASSWORD'),
				database: config.get<string>('TYPEORM_DATABASE'),
				entities: [__dirname + '/**/*.entity.{ts,js}'],
				migrations: [__dirname + '/src/migrations/**/*.ts'],
				synchronize: false,
				migrationsRun: true,
				autoLoadEntities: true,
				logging: true,
			}),
		}),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
			context: ({ req, res }) => {
				return { req, res };
			},
			sortSchema: true,
		}),
		AuthModule,
		UsersModule,
		ProductsModule,
		OrdersModule,
		OrderItemsModule,
		NotificationsGateway,
	],
})
export class AppModule {}
