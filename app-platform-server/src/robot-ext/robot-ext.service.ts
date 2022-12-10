import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ImService } from 'src/im/im.service';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { genId } from 'src/utils/snowflake';
import { Repository } from 'typeorm';
import { RobotCreatedDO } from './entities/robot-created.entity';
import { RobotVO } from './vo/robot.vo';
@Injectable()
export class RobotExtService {
  constructor(
    private readonly imService: ImService,
    private readonly configService: ConfigService,
    @InjectRepository(RobotCreatedDO)
    private readonly dao: Repository<RobotCreatedDO>
  ) { }

  async getListRobots(userId: string) {
    const doList = await this.dao.find({ where: { userId } })
    const list = []
    for (const iterator of doList) {
      const robot = new RobotVO(iterator)
      robot.webhook = this.createWebhook(iterator.key)
      list.push(robot)
    }
    return ResultFactory.success({ list })
  }

  async create(username: string, serverId: string, channelId: string, robotNickname: string) {
    const res = await this.imService.createRobot(username, robotNickname, serverId)
    if (res.error()) {
      return res
    }
    const robotUsername = res.getValue()
    // 设置机器人标识
    const setRes = await this.imService.setRobotTag(robotUsername, robotNickname)
    if (setRes.error()) {
      return setRes
    }
    const addRes = await this.imService.addRobotToServer(robotUsername, serverId, channelId)
    if (addRes.error()) {
      return addRes
    }
    const { serverName, channelName } = addRes.getValue()
    const key = genId()
    const data = this.dao.create({ userId: username, robotUsername, robotNickname, serverName, channelId, channelName, key })
    const robotDO = await this.dao.save(data)

    const robot = new RobotVO(robotDO)
    robot.webhook = this.createWebhook(key)
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
    robot.webhook = this.createWebhook(key)
    return ResultFactory.success({ robot })
  }

  private createWebhook(key: string) {
    return `http://${this.configService.get('app.ip')}:${this.configService.get('app.port')}/im/robot/webhook/send?key=${key}`
  }

}
