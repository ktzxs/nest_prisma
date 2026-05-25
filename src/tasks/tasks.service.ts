import { 
		HttpException, 
		HttpStatus, 
		Injectable, 
		NotFoundException
	} from '@nestjs/common';
import { UpdateTaskDto } from './dto/update.task.dto';
import { CreateTaskDto } from './dto/create.task.dto';
import { DatabaseService } from '../database/database.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { resolvePaginationDto } from '../common/pagination/resolvePagination';
import { PayLoadTokenDto } from '../auth/dto/payload-token.dto';

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
			if(task) {
				return task;
			}
			throw new HttpException('Tarefa não encontrada', HttpStatus.NOT_FOUND)
		} catch (err) {
			if (err instanceof HttpException) throw err
			throw new HttpException(
				"erro ao buscar tarefa",
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
    }

    async create(createTaskDto: CreateTaskDto, tokenPayLoad: PayLoadTokenDto) {
        try {
			const newTask = await this.databaseService.task.create({
				data: {
					name: createTaskDto.name,
					description: createTaskDto.description,
					userId: tokenPayLoad.sub,
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

    async update(id: number, updateTaskDto: UpdateTaskDto, tokenPayLoad: PayLoadTokenDto) {
		try {
			const findTask = await this.databaseService.task.findUnique({
				where: { id }
			});
			if(!findTask) {
				throw new NotFoundException('Tarefa não encontrada')
			}

			if(findTask.userId !== tokenPayLoad.sub) {
				throw new HttpException(
					"You are not permission for update task", HttpStatus.UNAUTHORIZED
				)
			}

			const updateTask = await this.databaseService.task.update({
				where: { id },
				data: updateTaskDto
			});
			return updateTask;
		} catch (err) {
			if ( err instanceof HttpException) throw err
			throw new HttpException(
				"erro ao atualizar tarefa",
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
    }

    async delete(id: number, TokenPayLoad: PayLoadTokenDto) {
      try {
			const findTask = await this.databaseService.task.findUnique({
				where: { id }
			});

			if(!findTask) {
				throw new NotFoundException('Tarefa não encontrada')
			}

				if(findTask.userId !== TokenPayLoad.sub) {
				throw new HttpException(
					"You are not permission delete for task", HttpStatus.UNAUTHORIZED
				)
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
