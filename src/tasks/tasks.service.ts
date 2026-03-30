import { 
		HttpException, 
		HttpStatus, 
		Injectable, 
		NotFoundException
	} from '@nestjs/common';
import { Task } from './entities/task.entitie';
import { UpdateTaskDto } from 'src/tasks/dto/update.task.dto';
import { CreateTaskDto } from 'src/tasks/dto/create.task.dto';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { find } from 'rxjs';

@Injectable()
export class TasksService {
	constructor(private readonly databaseService: DatabaseService) {}

    async listAllTasks() {
        const allTasks = this.databaseService.task.findMany();
		return allTasks
    }


    async findOneTaks(id: number) {
        try {
			const task = await this.databaseService.task.findUnique({
				where: { id }
			});
			return task;
		} catch (err) {
			throw new HttpException(
				"erro ao buscar tarefa",
				HttpStatus.INTERNAL_SERVER_ERROR
			) 
		}
    }

    async create(createTaskDto: CreateTaskDto) {
        try {
			const newTask = await this.databaseService.task.create({
				data: {
					title: createTaskDto.name,
					description: createTaskDto.description
				}
			});
			return newTask;
		} catch (err) {
			throw new HttpException(
				"erro ao criar tarefa",
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		}
    }

    async update(id: number, updateTaskDto: UpdateTaskDto) {
		try {
			const findTask = await this.databaseService.task.findUnique({
				where: { id }
			});
			if(!findTask) {
				throw new NotFoundException('Tarefa não encontrada')
			}

			const updateTask = await this.databaseService.task.update({
				where: { id },
				data: updateTaskDto
			});
			return updateTask;
		} catch (err) {
			throw new HttpException(
				"erro ao atualizar tarefa",
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
    }

    async delete(id: number) {
      try {
			const findTask = await this.databaseService.task.findUnique({
				where: { id }
			});
			if(!findTask) {
				throw new NotFoundException('Tarefa não encontrada')
			}
			await this.databaseService.task.delete({
				where: { id }
			});
			return { message: 'Tarefa deletada com sucesso'};
		} catch (err) {
			throw new HttpException(
				'erro ao deletar tarefa',
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		}
    }
}
