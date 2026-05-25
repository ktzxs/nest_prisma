import {
	Controller,
	Get,
	Param,
	Body,
	ParseIntPipe,
	Post,
	Put,
	Delete,
	UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { Request } from '@nestjs/common';
import { REQUEST_TOKE_PAYLOAD_NAME } from '../auth/common/auht.constants';
import { TokenPayLoadParam } from '../auth/param/token-payload.param';
import { PayLoadTokenDto } from '../auth/dto/payload-token.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get(':id')
	findOneUser(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.findOne(id);
	}

	@Post()
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@UseGuards(AuthTokenGuard)
	@Put(':id')
	updateUser
	(@Param('id', ParseIntPipe) id: number, 
	@Body() updateUserDto: UpdateUserDto,
	@TokenPayLoadParam() tokenPayLoad: PayLoadTokenDto
) {
		return this.usersService.update(id, updateUserDto, tokenPayLoad);
	}

	@UseGuards(AuthTokenGuard)
	@Delete(':id')
	deleteUser(
		@Param('id', ParseIntPipe) id: number,
		@TokenPayLoadParam() tokenPayLoad: PayLoadTokenDto
	) {
		return this.usersService.delete(id, tokenPayLoad);
	}
}