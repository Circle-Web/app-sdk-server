import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ImService } from 'src/im/im.service';
import { encrypt } from 'src/utils/cryptogram';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { Repository } from 'typeorm';
import { RobotCreatedDO } from './entities/robot-created.entity';
@Injectable()
export class RobotExtService {

  constructor(
    private readonly imService: ImService,
    private readonly configService: ConfigService,
    @InjectRepository(RobotCreatedDO)
    private readonly dao: Repository<RobotCreatedDO>
  ) { }

  async getListRobots(userId: string) {
    const data = await this.dao.find({ where: { userId } })
    return ResultFactory.success(data)
  }

  async create(username: string, serverId: string, channelId: string, robotNickname: string) {
    const res = await this.imService.createRobot(username, robotNickname)
    if (res.error()) {
      return res
    }
    const robotUsername = res.getValue()
    // 设置机器人标识
    const setRes = await this.imService.setRobotTag(robotUsername)
    if (setRes.error()) {
      return setRes
    }
    const addRes = await this.imService.addRobotToServer(robotUsername, serverId, channelId)
    if (addRes.error()) {
      return addRes
    }
    const { serverName, channelName } = addRes.getValue()
    const key = encrypt(robotUsername)
    const webhook = `http://${this.configService.get('app.ip')}:${this.configService.get('app.port')}/im/robot/webhook/send?key=${key}`
    const data = this.dao.create({ userId: username, robotUsername, robotNickname, serverName, channelId, channelName, webhook })
    await this.dao.save(data)
    return ResultFactory.success({
      robotNickname,
      webhook
    })
  }
}
