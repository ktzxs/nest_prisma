import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SingInDto } from './dto/singin.dto';
import { DatabaseService } from '../database/database.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private readonly DatabaseService: DatabaseService,
		private readonly hashingService: HashingServiceProtocol,

		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
		private readonly jwtService: JwtService
	) {}

	async authenticate(SignInDto: SingInDto) {
		const user = await this.DatabaseService.user.findUnique({
			where: {
				email: SignInDto.email
			}
		});

		if (!user) {
			throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
		}

		const passwordIsValid = await this.hashingService.compare(
			SignInDto.password,
			user.passwordHash
		);

		if (!passwordIsValid) {
			throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
		}

		if (!this.jwtConfiguration.secret) {
			throw new HttpException('JWT secret is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
		}

		const tokenTtl = this.jwtConfiguration.ttl;
		const expiresIn = tokenTtl
			? /^\d+$/.test(tokenTtl)
				? Number(tokenTtl)
				: tokenTtl
			: undefined;

		const token = await this.jwtService.signAsync(
			{
				sub: user.id,
				email: user.email,
				username: user.name
			},
			{
			secret: this.jwtConfiguration.secret,
			expiresIn: expiresIn as any,
			audience: this.jwtConfiguration.audience,
			issuer: this.jwtConfiguration.issuer,
			}
		);
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			token
		};
	}
}