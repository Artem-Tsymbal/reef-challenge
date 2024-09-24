import { Injectable, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserInput } from './dto/register-user.input';
import { LoginUserInput } from './dto/login-user.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ITokens } from './interfaces/tokens.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService, private configService: ConfigService) {}

	async register(registerUserInput: RegisterUserInput): Promise<ITokens> {
		const hashedPassword = await bcrypt.hash(registerUserInput.password, 10);
		const user = await this.usersService.create({
			...registerUserInput,
			password: hashedPassword,
		});
		const tokens = await this.getTokens(user.id, user.email);
		await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
		return tokens;
	}

	async login(loginUserInput: LoginUserInput): Promise<ITokens> {
		const user = await this.usersService.findByEmail(loginUserInput.email);
		if (!user) throw new ForbiddenException('Access Denied');

		const passwordMatches = await bcrypt.compare(loginUserInput.password, user.password);
		if (!passwordMatches) throw new ForbiddenException('Access Denied');

		const tokens = await this.getTokens(user.id, user.email);
		await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
		return tokens;
	}

	async logout(userId: number): Promise<void> {
		await this.usersService.updateRefreshToken(userId, null);
	}

	async refreshTokens(userId: number, refreshToken: string): Promise<ITokens> {
		const user = await this.usersService.findById(userId);
		if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

		const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
		if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

		const tokens = await this.getTokens(user.id, user.email);
		await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
		return tokens;
	}

	async getTokens(userId: number, email: string): Promise<ITokens> {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
				{ userId, email },
				{
					secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
					expiresIn: '1d',
				},
			),
			this.jwtService.signAsync(
				{ userId, email },
				{
					secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
					expiresIn: '7d',
				},
			),
		]);

		return {
			accessToken,
			refreshToken,
		};
	}
}
