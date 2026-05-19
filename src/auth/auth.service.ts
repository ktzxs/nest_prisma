import { Injectable, HttpStatus, HttpException, Inject } from '@nestjs/common';
import { SingInDto } from './dto/singin.dto';
import { DatabaseService } from 'src/database/database.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly hashingService: HashingServiceProtocol,

		@Inject(jwtConfig.KEY)
		private readonly jwtConfigService: ConfigType<typeof jwtConfig>,
	) { }

	async authenticate(signInDto: SingInDto) {
		const user = await this.databaseService.user.findUnique({
			where: { email: signInDto.email },
		});

		if (!user) {
			throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
		}

		const isPasswordValid = await this.hashingService.compare(
			signInDto.password,
			user.passwordHash
		)

		if (!isPasswordValid) {
			throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
		}

		return {
			id: user.id,
			email: user.email,
			name: user.name,
			message: 'Authentication successful'
		}
	}
}