import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { DatabaseModule } from '../database/database.module';
import { TaskUtils } from './task.utils';

@Module({
    imports: [DatabaseModule],
    controllers: [TasksController],
    providers: [TasksService, TaskUtils]
})
export class TasksModule {}
