import { 
		HttpException, 
		HttpStatus, 
		Injectable, 
		NotFoundException
	} from '@nestjs/common';
import { UpdateTaskDto } from 'src/tasks/dto/update.task.dto';
import { CreateTaskDto } from 'src/tasks/dto/create.task.dto';
import { DatabaseService } from 'src/database/database.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { resolvePaginationDto } from 'src/common/pagination/resolvePagination';

@Injectable()
export class TasksService {
	constructor(private readonly databaseService: DatabaseService) {}

    async listAllTasks(paginationDto: PaginationDto) {
		const { limit , offset } = resolvePaginationDto(paginationDto)
        try {
			const allTasks = await this.databaseService.task.findMany({
				take: limit,
				skip: offset,
				orderBy: {
					createdAt: 'desc'
				}
			});
			return allTasks;
		} catch (err) {
			throw new HttpException(
				"Erro ao listar tarefas",
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
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
					name: createTaskDto.name,
					description: createTaskDto.description,
					userId: createTaskDto.userId,
					completed: false
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
