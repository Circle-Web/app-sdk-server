import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImModule } from 'src/im/im.module';
import { InternalRobotDO } from './entities/internal-robot.entity';
import { RobotController } from './robot.controller';
import { RobotService } from './robot.service';
import { GuessNumberService } from './weather-robot/guess-number.service';
import { WeatherRobotService } from './weather-robot/weather-robot.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        timeout: config.get('http.timeout')
      }),
      inject: [
        ConfigService
      ]
    }),
    ImModule, TypeOrmModule.forFeature([InternalRobotDO]),
    ScheduleModule.forRoot()
  ],
  controllers: [RobotController],
  providers: [RobotService, WeatherRobotService, GuessNumberService],
  exports: [RobotService]
})
export class RobotModule { }
