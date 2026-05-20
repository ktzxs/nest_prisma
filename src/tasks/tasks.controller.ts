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
@Controller('tasks')
@UseGuards(AuthAdminGuard)
export class TasksController {
    constructor(private readonly taskService: TasksService) {}
    
    @Get()
    @UseInterceptors(LoggerInterceptor)
    @UseInterceptors(AddHeaderInterceptor)
    //@UseGuards(AuthAdminGuard)
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

    @Post()
    @UseInterceptors(LoggerInterceptor)
    @UseInterceptors(BodyCreateTaskInterceptor)
    createTask(@Body() createTaskDto: CreateTaskDto) {
        return this.taskService.create(createTaskDto)
    }

    @Put(':id') //Patch
    updateTask(@Param('id', ParseIntPipe) id: number, @Body() updateTask: UpdateTaskDto) {
        return this.taskService.update(id, updateTask)
    }

    @Delete(':id')
    deleteTask(@Param('id') id: number) {
        return this.taskService.delete(id)
    }
}
