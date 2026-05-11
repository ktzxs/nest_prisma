import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingInDto } from './dto/singin.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    singIn(@Body() singInDto: SingInDto) {
        return this.authService.authenticate(singInDto);
    }
}
