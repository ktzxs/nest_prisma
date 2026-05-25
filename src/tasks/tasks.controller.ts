import { 
    Controller, 
    Get, 
    Param, 
    Post,
    Body,
    Query,
    Put,
    Delete,
    ParseIntPipe,
    UseGuards
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto'
import { PaginationDto } from '../common/dto/pagination.dto';
import { UseInterceptors } from '@nestjs/common';
import { LoggerInterceptor } from '../common/interceptors/logger.interceptor';
import { AddHeaderInterceptor } from '../common/interceptors/add-header.interceptor';
import { BodyCreateTaskInterceptor } from '../common/interceptors/body-create-task.interceptor';
import { AuthAdminGuard } from '../common/guards/admin.guard';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { PayLoadTokenDto } from '../auth/dto/payload-token.dto';
import { TokenPayLoadParam } from '../auth/param/token-payload.param';
@Controller('tasks')
@UseGuards(AuthAdminGuard)
export class TasksController {
    constructor(private readonly taskService: TasksService) {}
    
    @Get()
    @UseInterceptors(LoggerInterceptor)
    @UseInterceptors(AddHeaderInterceptor)
    getTasks(@Query() paginationDto: PaginationDto) {
        return this.taskService.listAllTasks(paginationDto)
    }

    @Get('/busca')
    findManyTasks(@Query() paginationDto: PaginationDto) {
        return this.taskService.listAllTasks(paginationDto)
    }

    @Get(':id')
    findSingleTasks(@Param('id', ParseIntPipe ) id: number) {
        return this.taskService.findOneTaks(id)
    }

    @UseGuards(AuthTokenGuard)
    @Post()
    @UseInterceptors(LoggerInterceptor)
    @UseInterceptors(BodyCreateTaskInterceptor)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @TokenPayLoadParam() TokenPayLoadParam: PayLoadTokenDto
    ) {
        return this.taskService.create(createTaskDto, TokenPayLoadParam)
    }

    @UseGuards(AuthTokenGuard)
    @Put(':id') 
    updateTask(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateTask: UpdateTaskDto,
        @TokenPayLoadParam() TokenPayLoadParam: PayLoadTokenDto
    ) {
        return this.taskService.update(id, updateTask, TokenPayLoadParam)
    }

    @Delete(':id')
    deleteTask(
        @Param('id') id: number,
        @TokenPayLoadParam() TokenPayLoadParam: PayLoadTokenDto
    ) {
        return this.taskService.delete(id, TokenPayLoadParam)
    }
}
