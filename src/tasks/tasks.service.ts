import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
    listAllTasks() {
        return [
            {id: 1, task: 'Comprar pao'},
            {id: 2, task: 'Estudar para prova'}
        ]
    }


    findOneTaks(id: string) {
        return {id: 2, task: 'comprar pao'}
    }

    create(body: any) {
        return body
    }

    update(id: string, body: any) {
        let retorno = { id, body }
        return retorno
    }

    delete(id: string) {
        return 'Deletar a tarefa' + id
    }
}
