import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImService } from 'src/im/im.service';
import { RobotBO } from 'src/robot/data/robot.bo';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { genId } from 'src/utils/snowflake';
import { Repository } from 'typeorm';
import { RobotVO } from './data/robot.vo';
import { RobotCreatedDO } from './entities/robot-created.entity';
@Injectable()
export class RobotExtService {

  constructor(
    private readonly imService: ImService,
    @InjectRepository(RobotCreatedDO)
    private readonly dao: Repository<RobotCreatedDO>
  ) { }

  async getListRobots(userId: string) {
    const doList = await this.dao.find({ where: { userId } })
    const list = []
    for (const iterator of doList) {
      const robot = new RobotVO(iterator)
      robot.webhook = this.imService.createWebhook(iterator.key)
      list.push(robot)
    }
    return ResultFactory.success({ list })
  }

  async saveRobot(robotBO: RobotBO) {
    const { userId, robotUsername, robotNickname, channelId, serverName, channelName, key } = robotBO
    const data = this.dao.create({ userId, robotUsername, robotNickname, serverName, channelId, channelName, key })
    const robotDO = await this.dao.save(data)

    const robot = new RobotVO(robotDO)
    robot.webhook = this.imService.createWebhook(key)
    return ResultFactory.success({ robot })
  }

  async resetKey(id: number, userId: string) {
    const robotDO = await this.dao.findOne({ where: { id, userId } })
    if (!robotDO) {
      return ResultFactory.create(ResultCode.PARAM_ERROR)
    }
    const key = genId()
    robotDO.key = key
    await this.dao.save(robotDO)
    const robot = new RobotVO(robotDO)
    robot.webhook = this.imService.createWebhook(key)
    return ResultFactory.success({ robot })
  }

  async robotDetail(id: number, userId: string) {
    const robotDO = await this.dao.findOne({ where: { id, userId } })
    if (!robotDO) {
      return ResultFactory.create(ResultCode.PARAM_ERROR)
    }
    const robot = new RobotVO(robotDO)
    robot.webhook = this.imService.createWebhook(robotDO.key)
    return ResultFactory.success({ robot })
  }
}
