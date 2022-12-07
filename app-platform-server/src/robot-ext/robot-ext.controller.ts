import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RobotExtService } from './robot-ext.service';

@Controller('api/ext/robot')
export class RobotExtController {
  constructor(private readonly robotExtService: RobotExtService) { }

  @Get('listRobots')
  listRobots(@Query() { username }) {
    return this.robotExtService.getListRobots(username)
  }

  @Post('create')
  create(@Body() { username, serverId, channelId, robotName }) {
    return this.robotExtService.create(username, serverId, channelId, robotName)
  }
}
