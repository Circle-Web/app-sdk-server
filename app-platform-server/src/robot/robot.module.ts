import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImModule } from 'src/im/im.module';
import { InternalRobotDO } from './entities/internal-robot.entity';
import { RobotController } from './robot.controller';
import { RobotService } from './robot.service';
import { WeatherRobotService } from './weather-robot/weather-robot.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        timeout: config.get('http.timeout')
      }),
      inject: [
        ConfigService
      ]
    }),
    ImModule, TypeOrmModule.forFeature([InternalRobotDO])],
  controllers: [RobotController],
  providers: [RobotService, WeatherRobotService],
  exports: [RobotService]
})
export class RobotModule { }
