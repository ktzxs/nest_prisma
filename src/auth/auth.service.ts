import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SingInDto } from './dto/singin.dto';
import { DatabaseService } from 'src/database/database.service';
import { HashingServiceProtocol } from './hash/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  async authenticate(singInDto: SingInDto) {
    const user = await this.databaseService.user.findUnique({
      where: { email: singInDto.email },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await this.hashingService.compare(
      singInDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      message: 'Authenticate succeful',
    };
  }
}
