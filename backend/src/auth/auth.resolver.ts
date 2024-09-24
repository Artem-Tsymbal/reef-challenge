import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterUserInput } from './dto/register-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { Auth } from './models/auth.model';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from './guards/graphql-jwt-auth.guard';

@Resolver()
export class AuthResolver {
	constructor(
		private readonly authService: AuthService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	@Mutation(() => Auth)
	async register(@Args('registerUserInput') registerUserInput: RegisterUserInput, @Context() context): Promise<Auth> {
		const tokens = await this.authService.register(registerUserInput);
		context.res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			sameSite: 'Lax',
			secure: false,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
		return { accessToken: tokens.accessToken };
	}

	@Mutation(() => Auth)
	async login(@Args('loginUserInput') loginUserInput: LoginUserInput, @Context() context): Promise<Auth> {
		const tokens = await this.authService.login(loginUserInput);

		context.res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			sameSite: 'Lax',
			secure: false,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return { accessToken: tokens.accessToken };
	}

	@UseGuards(GraphqlJwtAuthGuard)
	@Mutation(() => Boolean)
	async logout(@Context() context) {
		const userId = context.req.user.userId;
		await this.authService.logout(userId);
		context.res.clearCookie('refreshToken');
		return true;
	}

	@Mutation(() => Auth)
	async refreshTokens(@Context() context): Promise<Auth> {
		const refreshToken = context.req.cookies['refreshToken'];
		if (!refreshToken) throw new ForbiddenException('Access Denied');

		let decoded: { userId: number };
		try {
			decoded = this.jwtService.verify(refreshToken, {
				secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
			});
		} catch (err) {
			throw new ForbiddenException('Invalid refresh token');
		}

		const tokens = await this.authService.refreshTokens(decoded.userId, refreshToken);

		context.res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			sameSite: 'Lax',
			secure: false,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return { accessToken: tokens.accessToken };
	}
}
