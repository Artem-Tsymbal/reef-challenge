import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = app.get(ConfigService);

	const PORT = config.get<number>('PORT') || 5001;

	app.use(cookieParser());

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		}),
	);

	app.enableCors({
		origin: config.get<string>('CORS_ORIGIN'),
		credentials: true,
	});

	await app.listen(PORT);
	console.log(`Server is running on http://localhost:${PORT}`);
}

bootstrap();
