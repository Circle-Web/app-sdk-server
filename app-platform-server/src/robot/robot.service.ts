import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImService } from 'src/im/im.service';
import { Result } from 'src/utils/result/result';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { genId } from 'src/utils/snowflake';
import { Repository } from 'typeorm';
import { InternalRobotMsgBO } from './data/internalRobotMsg.bo';
import { KeywordType } from './data/keywordType';
import { RobotBO } from './data/robot.bo';
import { RobotType } from './data/robotType';
import { KeywordTriggerDto } from './dto/keyword-trigger.dto';
import { InternalRobotDO } from './entities/internal-robot.entity';
import { GuessNumberService } from './weather-robot/guess-number.service';
import { TellJokeService } from './weather-robot/tell-joke.service';
import { WeatherRobotService } from './weather-robot/weather-robot.service';

const ruleMatch = /#规则/ig
const weatherMatch = /#天气查询[:： ]*/ig
const guessNumberMatch = /#猜数字[:： ]*/ig
const speekMatch = /#讲个笑话[:： ]*/ig
const robotNickname = "频道专属机器人"
@Injectable()
export class RobotService {
  constructor(
    private readonly imService: ImService,
    private readonly weatherRobotService: WeatherRobotService,
    private readonly guessNumberService: GuessNumberService,
    private readonly tellJokeService: TellJokeService,
    @InjectRepository(InternalRobotDO)
    private readonly dao: Repository<InternalRobotDO>
  ) { }

  async chatKeywordTrigger(dto: KeywordTriggerDto) {
    const { username, keyword, fromNickName, serverId, channelId } = dto
    const match = this.parseString(keyword)
    if (!match) {
      return ResultFactory.success()
    }
    const type = match.type
    let internalRobot = await this.dao.findOne({ where: { serverId, channelId } })
    if (!internalRobot) {
      const res = await this.tryCreateInternalRobot(serverId, channelId)
      if (res.error()) {
        return res
      }
      internalRobot = res.getValue()
    }
    const msg = new InternalRobotMsgBO(username, fromNickName, internalRobot, channelId)
    switch (type) {
      case KeywordType.规则:
        this.handleGetKeywordRule(msg)
        break;
      case KeywordType.天气:
        this.handleWeatherKeyword(msg, match)
        break;
      case KeywordType.猜数字:
        this.handleGuessNumberKeyword(msg, match)
        break;
      case KeywordType.讲个笑话:
        this.handleSpeek(msg)
      default:
        break;
    }
    return ResultFactory.success()
  }

  private handleSpeek(msg: InternalRobotMsgBO) {
    this.tellJokeService.tryTellJoke(msg)
  }

  private parseString(str: string) {
    if (str.match(ruleMatch)?.length) {
      return {
        type: KeywordType.规则,
      }
    }
    if (str.match(weatherMatch)?.length) {
      const keyword = str.replace(weatherMatch, "").trim()
      return {
        type: KeywordType.天气,
        keyword: keyword
      }
    }
    if (str.match(speekMatch)?.length) {
      return {
        type: KeywordType.讲个笑话,
      }
    }
    if (str.match(guessNumberMatch)?.length) {
      const keyword = str.replace(guessNumberMatch, "").trim()
      const data = keyword.split(",")
      return {
        type: KeywordType.猜数字,
        keyword: {
          min: +data[0] ?? 0,
          max: +data[1] ?? 0,
          durationSeconds: +data[2] ?? 0
        }
      }
    }
    const n = Number(str)
    if (!isNaN(n)) {
      return {
        type: KeywordType.猜数字,
        keyword: {
          answerNumber: n
        }
      }
    }
    return null
  }

  private handleGetKeywordRule(msg: InternalRobotMsgBO) {
    const weatherRule = `1.天气查询：发送“#天气查询: 地域名”即可查询当地天气，支持中英文冒号，以及兼容空格的情况`
    const guessRule = `2.猜数字：发送“#猜数字 1,100,60”的格式即可创建猜数字游戏，数字格式部分，前两个数字表示游戏的下限和上限，第三个数字表示持续时间，游戏时长应当大于等于“30秒”且小于等于“180秒”。游戏创建成功后，用户发送数字即可参与游戏，直至第一位用户猜中关键数字，则游戏结束。`
    const speek = `3.讲个笑话：发送“#讲个笑话” 则可以查询笑话`
    msg.desc = "\r\n" + [weatherRule, guessRule, speek].join("\r\n")
    this.imService.internalRobotSendMsg(msg)
  }

  private handleWeatherKeyword(msg: InternalRobotMsgBO, match: any) {
    this.weatherRobotService.trySearch(msg, match.keyword)
  }

  private handleGuessNumberKeyword(msg: InternalRobotMsgBO, match: any) {
    const { keyword } = match
    if (keyword.answerNumber) {
      this.guessNumberService.tryAnswerNumber(msg, keyword.answerNumber)
    } else if (keyword.min) {
      this.guessNumberService.tryCreateGame(msg, keyword.min, keyword.max, keyword.durationSeconds)
    }
  }

  async tryCreateInternalRobot(serverId: string, channelId: string) {
    const username = `${channelId}_${+new Date}`
    let res = await this.imService.regiesterIMUser(username, robotNickname)
    if (res.error()) {
      return res
    }
    const robotUsername = res.getValue()
    res = await this.setAndAdd(serverId, channelId, robotNickname, robotUsername, RobotType.专属)
    if (res.error()) {
      return res
    }
    const { key } = res.getValue()
    const internalRobot = this.dao.create({ serverId, channelId, robotUsername, robotNickname, key })
    await this.dao.save(internalRobot)
    return ResultFactory.success(internalRobot)
  }

  async createRobot(username: string, serverId: string, channelId: string, robotNickname: string): Promise<Result<any>> {
    const res = await this.imService.createRobot(username, robotNickname, serverId)
    if (res.error()) {
      return res
    }
    const robotUsername = res.getValue()
    return this.setAndAdd(serverId, channelId, robotNickname, robotUsername, RobotType.普通)
  }

  private async setAndAdd(serverId: string, channelId: string, robotNickname: string, robotUsername: string, robotType: number): Promise<Result<any>> {
    // 设置机器人标识
    const setRes = await this.imService.setRobotTag(robotUsername, robotNickname, robotType)
    if (setRes.error()) {
      return setRes
    }
    const addRes = await this.imService.addRobotToServer(robotUsername, serverId, channelId)
    if (addRes.error()) {
      return addRes
    }
    const { serverName, channelName } = addRes.getValue()
    const key = genId()
    const robot = new RobotBO(robotUsername, robotNickname, serverId, channelId, serverName, channelName, key)
    return ResultFactory.success(robot)
  }
}


