import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImMsg } from 'src/im/dto/im-msg.dto';
import { ImService } from 'src/im/im.service';
import { Result } from 'src/utils/result/result';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { genId } from 'src/utils/snowflake';
import { Repository } from 'typeorm';
import { KeywordType } from './data/keywordType';
import { RobotBO } from './data/robot.bo';
import { KeywordTriggerDto } from './dto/keyword-trigger.dto';
import { InternalRobotDO } from './entities/internal-robot.entity';
import { WeatherRobotService } from './weather-robot/weather-robot.service';

@Injectable()
export class RobotService {
  constructor(
    private readonly imService: ImService,
    private readonly weatherRobotService: WeatherRobotService,
    @InjectRepository(InternalRobotDO)
    private readonly dao: Repository<InternalRobotDO>
  ) { }

  async chatKeywordTrigger(dto: KeywordTriggerDto) {
    const { type, keyword, fromNickName, serverId, channelId } = dto
    if (type in KeywordType === false) {
      return ResultFactory.success()
    }
    let internalRobot = await this.dao.findOne({ where: { channelId } })
    if (!internalRobot) {
      const res = await this.tryCreateInternalRobot(serverId, channelId)
      if (res.error()) {
        return res
      }
      internalRobot = res.getValue()
    }
    switch (type) {
      case KeywordType.天气:
        this.weatherRobotService.search(keyword).then(r => {
          if (r.error()) {
            return
          }
          const desc = r.getValue()
          const msg = new ImMsg()
          msg.from = internalRobot.robotUsername
          msg.to = [`${channelId}`]
          msg.body = {
            msg: `@${fromNickName}\n${desc}`
          }
          // console.log(msg.body.msg)
          this.imService.internalRobotSendMsg(msg)
        })
        break;
      default:
        break;
    }
    return ResultFactory.success()
  }

  async tryCreateInternalRobot(serverId: string, channelId: string) {
    const robotNickname = "频道专属机器人"
    const username = `${channelId}_${+new Date}`
    let res = await this.imService.regiesterIMUser(username, robotNickname)
    if (res.error()) {
      return res
    }
    const robotUsername = res.getValue()
    res = await this.setAndAdd(serverId, channelId, robotNickname, robotUsername)
    if (res.error()) {
      return res
    }
    const { key } = res.getValue()
    const internalRobot = this.dao.create({ channelId, robotUsername, robotNickname, key })
    await this.dao.save(internalRobot)
    return ResultFactory.success(internalRobot)
  }

  async createRobot(username: string, serverId: string, channelId: string, robotNickname: string): Promise<Result<any>> {
    const res = await this.imService.createRobot(username, robotNickname, serverId)
    if (res.error()) {
      return res
    }
    const robotUsername = res.getValue()
    return this.setAndAdd(serverId, channelId, robotNickname, robotUsername)
  }

  async setAndAdd(serverId: string, channelId: string, robotNickname: string, robotUsername: string): Promise<Result<any>> {
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
    const robot = new RobotBO(robotUsername, robotNickname, channelId, serverName, channelName, key)
    return ResultFactory.success(robot)
  }
}
