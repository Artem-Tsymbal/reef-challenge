import { Resolver, Query, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';

@Resolver(() => User)
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(GraphqlJwtAuthGuard)
	@Query(() => User)
	async me(@Context() context): Promise<User> {
		const userId = context.req.user.userId;
		return this.usersService.findById(userId);
	}
}
