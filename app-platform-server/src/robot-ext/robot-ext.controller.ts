import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RobotService } from 'src/robot/robot.service';
import { RobotExtService } from './robot-ext.service';

@Controller('api/ext/robot')
export class RobotExtController {
  constructor(
    private readonly robotExtService: RobotExtService,
    private readonly robotService: RobotService,
  ) { }

  @Get('listRobots')
  listRobots(@Query() { username }) {
    return this.robotExtService.getListRobots(username)
  }

  @Post('create')
  async create(@Body() { username, serverId, channelId, robotName }) {
    const res = await this.robotService.createRobot(username, serverId, channelId, robotName)
    if (res.error()) {
      return res
    }
    return this.robotExtService.saveRobot(res.getValue())
  }

  @Post('resetKey')
  resetKey(@Body() { id, username }) {
    return this.robotExtService.resetKey(id, username)
  }

  @Get('robotDetail')
  robotDetail(@Query() { id, username }) {
    return this.robotExtService.robotDetail(id, username)
  }

}
