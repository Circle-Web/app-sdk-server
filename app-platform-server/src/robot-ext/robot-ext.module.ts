import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImModule } from 'src/im/im.module';
import { RobotCreatedDO } from './entities/robot-created.entity';
import { RobotExtController } from './robot-ext.controller';
import { RobotExtService } from './robot-ext.service';

@Module({
  imports: [ImModule, TypeOrmModule.forFeature([RobotCreatedDO])
  ],
  controllers: [RobotExtController],
  providers: [RobotExtService]
})
export class RobotExtModule { }
