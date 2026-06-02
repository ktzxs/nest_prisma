import {
	Controller,
	ParseIntPipe,
	Get,
	Param,
	Post,
	Body,
	Put,
	Delete,
	UseGuards,
	Req,
	UploadedFile,
	UseInterceptors,
	HttpStatus,
	ParseFilePipeBuilder,
	UploadedFiles
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create.user.dto'
import { UpdateUserDto } from './dto/update.user.dto'
import { AuthTokenGuard } from '../auth/guard/auth-token.guard'
import { Request } from 'express'
import { REQUEST_TOKE_PAYLOAD_NAME } from '../auth/common/auht.constants';
import { TokenPayLoadParam } from '../auth/param/token-payload.param';
import { PayLoadTokenDto } from '../auth/dto/payload-token.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import 'multer'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { randomUUID } from 'node:crypto'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

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
	updateUser(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateUserDto: UpdateUserDto,
		@TokenPayLoadParam() tokenPayload: PayLoadTokenDto
	) {
		return this.usersService.update(id, updateUserDto, tokenPayload);
	}

	@UseGuards(AuthTokenGuard)
	@Delete(':id')
	deleteUser(
		@Param('id', ParseIntPipe) id: number,
		@TokenPayLoadParam() tokenPayload: PayLoadTokenDto
	) {
		return this.usersService.delete(id, tokenPayload);
	}

	@UseGuards(AuthTokenGuard)
	@UseInterceptors(FileInterceptor('file'))
	@Post('upload')
	async uploadAvatar(
		@TokenPayLoadParam() tokenPayload: PayLoadTokenDto,
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
		return this.usersService.uploadAvatarImage(tokenPayload, file);
	}

		@UseGuards(AuthTokenGuard)
	@UseInterceptors(FilesInterceptor('file'))
	@Post('uploads')
	async uploadFiles(
		@TokenPayLoadParam() tokenPayload: PayLoadTokenDto,
		@UploadedFiles() files: Array<Express.Multer.File>
		) {
			files.forEach(async (file) => {
				const mimeType = file.mimetype
				const fileExtension = path.extname(file.originalname).toLowerCase().substring(1)
				const fileName = `${randomUUID()}.${fileExtension}`
				const fileLocale = path.resolve(process.cwd(), 'public', 'files', fileName)

				await fs.promises.writeFile(fileLocale, file.buffer)
			})
			return true
	}
}