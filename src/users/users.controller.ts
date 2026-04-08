import { 
    Controller, 
    Param, 
    ParseIntPipe,
    Get,
    Post,
    Body,
    Put,
    Delete
 } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':id')
    findOneUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }

    @Put(':id')
    updateUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.update(id, UpdateUserDto);
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.delete(id)
    }
}
