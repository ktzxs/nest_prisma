import {
	Controller,
	Get,
	Param,
	Body,
	ParseIntPipe,
	Post,
	Put,
	Delete,
	UseGuards,
	UploadedFile,
	UseInterceptors,
	ParseFilePipeBuilder,
	HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { Request } from '@nestjs/common';
import { REQUEST_TOKE_PAYLOAD_NAME } from '../auth/common/auht.constants';
import { TokenPayLoadParam } from '../auth/param/token-payload.param';
import { PayLoadTokenDto } from '../auth/dto/payload-token.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer'
import * as path from 'node:path';
import * as fs from 'node:fs';
import { randomUUID } from 'node:crypto';

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

	@UseGuards(AuthTokenGuard)
	@UseInterceptors(FileInterceptor('file'))
	@Post('uploads')
	async uploadFiles(
		@TokenPayLoadParam() tokenPayLoad: PayLoadTokenDto,
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: /jpeg|jpg|png/g
				})
				.addMaxSizeValidator({
					maxSize: (1024 * 1024) * 1 // 1MB
				})
				.build({
					errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
				})
		) files: Array<Express.Multer.File>
	) {
		files.forEach(async (file) => {
			const mimeType = file.mimetype
			const fileExtension = path.extname(file.originalname).toLocaleLowerCase().substring(1)
			const fileName = `${tokenPayLoad.sub}-${fileExtension}`
			const fileLocale = path.resolve(process.cwd(), 'public', 'files', fileName)

			await fs.promises.writeFile(fileLocale, file.buffer)
		})
	}

	@UseGuards(AuthTokenGuard)
	@UseInterceptors(FileInterceptor('file'))
	@Post('avatar')
	async uploadAvatar(
		@TokenPayLoadParam() tokenPayLoad: PayLoadTokenDto,
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: /jpeg|jpg|png/g
				})
				.addMaxSizeValidator({
					maxSize: (1024 * 1024) * 1 // 1MB
				})
				.build({
					errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
				})
		) file: Express.Multer.File
	) {
		const mimeType = file.mimetype
		const fileExtension = path.extname(file.originalname).toLocaleLowerCase().substring(1)
		const fileName = `${tokenPayLoad.sub}-${fileExtension}`
		const fileLocale = path.resolve(process.cwd(), 'public', 'files', fileName)

		await fs.promises.writeFile(fileLocale, file.buffer)
	}
}