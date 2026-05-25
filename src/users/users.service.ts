import {
	HttpException,
	HttpStatus,
	Injectable,
	Post,
	Body,
	Put
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { HashingServiceProtocol } from '../auth/hash/hashing.service';
import { PayLoadTokenDto } from '../auth/dto/payload-token.dto';

@Injectable()
export class UsersService {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly hashingService: HashingServiceProtocol
	) { }

	async findOne(id: number) {
		const user = await this.databaseService.user.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				email: true,
				tasks: true
			}
		});

		if (user) return user;

		throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
	}

	async create(@Body() createUserDto: CreateUserDto) {
		try {
			const passwordHash = await this.hashingService.hash(createUserDto.password);
			const newUser = await this.databaseService.user.create({
				data: {
					name: createUserDto.name,
					email: createUserDto.email,
					passwordHash: passwordHash
				},
				select: {
					id: true,
					name: true,
					email: true,
				}
			});

			return newUser;
		} catch (error) {
			if (error instanceof HttpException) throw error;
			throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async update(id: number, updateUserDto: UpdateUserDto, tokenPayload: PayLoadTokenDto) {
		try {
			let passwordHash = ""
			const findUser = await this.databaseService.user.findUnique({
				where: { id }
			});

			if (!findUser) {
				throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
			}

			if(findUser.id !== tokenPayload.sub) {
				throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
			}

			if (updateUserDto.password) {
				passwordHash = await this.hashingService.hash(updateUserDto.password);
			}
			const updatedUser = await this.databaseService.user.update({
				where: { id },
				data: {
					name: updateUserDto.name ? updateUserDto.name : findUser.name,
					passwordHash: updateUserDto.password ? passwordHash : findUser.passwordHash
				},
				select: {
					id: true,
					name: true,
					email: true
				}
			});

			return updatedUser;
		} catch (error) {
			if (error instanceof HttpException) throw error;
			throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async delete(id: number, tokenPayload: PayLoadTokenDto) {
		try {
			const findUser = await this.databaseService.user.findUnique({
				where: { id }
			});

			if (!findUser) {
				throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
			}

			if(findUser.id !== tokenPayload.sub) {
				throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
			}

			await this.databaseService.user.delete({
				where: { id }
			});

			return { message: 'User deleted successfully' };
		} catch (error) {
			if (error instanceof HttpException) throw error;
			throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}