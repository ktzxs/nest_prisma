import { 
    Controller, 
    Get, 
    Param, 
    Post,
    Body,
    Query,
    Put,
    Delete,
    ParseIntPipe
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'src/tasks/dto/create.task.dto';
import { UpdateTaskDto } from 'src/tasks/dto/update.task.dto'

@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) { }
    
    @Get()
    getTasks() {
        return this.taskService.listAllTasks()
    }

    @Get('/busca')
    findManyTasks(@Query() queryParam: any) {
        return this.taskService.listAllTasks()
    }

    @Get(':id')
    findSingleTasks(@Param('id', ParseIntPipe ) id: number) {
        return this.taskService.findOneTaks(id)
    }

    @Post()
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
