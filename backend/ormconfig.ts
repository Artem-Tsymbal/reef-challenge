import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.TYPEORM_HOST,
	username: process.env.TYPEORM_USERNAME,
	password: process.env.TYPEORM_PASSWORD,
	database: process.env.TYPEORM_DATABASE,
	port: Number(process.env.TYPEORM_PORT),
	entities: [__dirname + '/**/*.entity.{ts,js}'],
	migrations: [__dirname + '/src/migrations/*.{ts,js}'],
	logging: true,
});

module.exports = AppDataSource;
