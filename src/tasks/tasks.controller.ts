import { 
    Controller, 
    Get, 
    Param, 
    Post,
    Body,
    Query,
    Put,
    Delete
} from '@nestjs/common';
import { TasksService } from './tasks.service';

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
    findSingleTasks(@Param("id") id: string) {
        return this.taskService.findOneTaks(id)
    }

    @Post()
    createTask(@Body() body: any) {
        return this.taskService.create(body)
    }

    @Put(':id') //Patch
    updateTask(@Param('id') id:string, @Body() body: any) {
        return this.taskService.update(id, body)
    }

    @Delete(':id')
    deleteTask(@Param('id') id: string) {
        return this.taskService.delete(id)
    }
}
