import { Global, Module } from '@nestjs/common';
import { HashingServiceProtocol } from './hash/hashing.service';
import { BcryptService } from './hash/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

// Módulo global - Pode ser importado em qualquer lugar sem precisar importar o módulo AuthModule
@Global()
	@Module({
		imports: [
			DatabaseModule,
			ConfigModule.forFeature(jwtConfig),
			JwtModule.registerAsync(jwtConfig.asProvider())
		],
	providers: [
		{
			provide: HashingServiceProtocol,
			useClass: BcryptService
		},
		AuthService
	],
	exports: [HashingServiceProtocol],
	controllers: [AuthController]
})
export class AuthModule {}