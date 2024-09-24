import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [JwtModule.register({}), UsersModule, ConfigModule],
	providers: [AuthService, AuthResolver, JwtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
