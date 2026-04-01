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
    Logger
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'src/tasks/dto/create.task.dto';
import { UpdateTaskDto } from 'src/tasks/dto/update.task.dto'
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UseInterceptors } from '@nestjs/common';
import { LoggerInterceptor } from 'src/common/interceptors/logger.interceptor';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { BodyCreateTaskInterceptor } from 'src/common/interceptors/body-create-task.interceptor';

@Controller('tasks')
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
