import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

	async create(userData: Partial<User>): Promise<User> {
		const user = this.usersRepository.create(userData);
		return this.usersRepository.save(user);
	}

	async findByEmail(email: string): Promise<User> {
		return this.usersRepository.findOne({ where: { email } });
	}

	async findById(id: number): Promise<User> {
		return this.usersRepository.findOne({ where: { id } });
	}

	async updateRefreshToken(userId: number, refreshToken: string | null) {
		let hashedRefreshToken: string = null;
		if (refreshToken) {
			hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
		}
		await this.usersRepository.update(userId, {
			refreshToken: hashedRefreshToken,
		});
	}
}
