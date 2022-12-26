import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ImService } from 'src/im/im.service';
import TimeUtil from 'src/utils/timeUtil';
import { InternalRobotMsgBO } from '../data/internalRobotMsg.bo';

@Injectable()
export class GuessNumberService {

    private readonly logger = new Logger(GuessNumberService.name);
    private channelId2BOMap: Map<string, GameCache> = new Map()

    constructor(
        private readonly imService: ImService,
    ) { }

    async tryCreateGame(msg: InternalRobotMsgBO, min: number, max: number, durationSeconds: number) {
        const { channelId } = msg
        if (this.channelId2BOMap.has(channelId)) {
            msg.desc = `游戏已被@${this.channelId2BOMap.get(channelId).msg.fromNickName} 创建啦~`
        } else if (min >= max) {
            msg.desc = "游戏范围不符合规范哦~从左到右分别是最小下限，最大上限，且不能相同"
        } else if (min < 0 || max < 0) {
            msg.desc = "游戏范围不符合规范哦~下限和上限必须要大于0，且不能相同"
        } else if (durationSeconds < TimeUtil.ONE_MINUTE_DURATION / 2 || durationSeconds > TimeUtil.ONE_MINUTE_DURATION * 3) {
            msg.desc = "游戏时长范围不符合规范哦~ 应当大于等于30秒且小于等于180秒"
        }
        if (msg.desc) {
            this.imService.internalRobotSendMsg(msg)
            return
        }
        return this.createGame(msg, min, max, durationSeconds)

    }

    private async createGame(msg: InternalRobotMsgBO, min: number, max: number, durationSeconds: number) {
        const game = new GameCache(msg, min, max, durationSeconds)
        this.channelId2BOMap.set(msg.channelId, game)
        msg.desc = `猜数字游戏创建成功，本次游戏的数字范围是：[${game.min}, ${game.max}], ${durationSeconds}秒后结束，抓紧时间哦~`
        msg.needAt = false
        this.imService.internalRobotSendMsg(msg)
    }

    async tryAnswerNumber(msg: InternalRobotMsgBO, answerNumber: number) {
        if (!this.channelId2BOMap.has(msg.channelId)) {
            return
        }
        const game = this.channelId2BOMap.get(msg.channelId)
        const { keyNumber, winUsername, min, max } = game
        if (winUsername) {
            // 已经有第一位用户猜中了
            return
        }
        if (keyNumber === answerNumber) {
            // 猜中了
            game.currentMin = answerNumber
            game.currentMax = answerNumber
            game.winUsername = msg.username
            msg.desc = `游戏结束，恭喜@${msg.fromNickName} 用户猜中啦~ 游戏的数字范围是：[${min}, ${max}], 关键数字为：${answerNumber}`
            msg.needAt = false
            this.imService.internalRobotSendMsg(msg)
        } else {
            if (answerNumber < keyNumber) {
                game.currentMin = answerNumber
            } else {
                game.currentMax = answerNumber
            }
            const second = Math.floor(((+game.endTime) - (+new Date)) / TimeUtil.ONE_SECOND_MILLS)
            msg.desc = `更新游戏的数字范围是：[${game.currentMin}, ${game.currentMax}]，剩余时间：${second}秒`
            msg.needAt = false
            this.imService.internalRobotSendMsg(msg)
        }
    }

    @Interval(TimeUtil.ONE_SECOND_MILLS)
    handleCleanCache() {
        this.channelId2BOMap.forEach((game, channelId) => {
            if (game.winUsername) {
                const msg: InternalRobotMsgBO = { ...game.msg }
                msg.desc = `猜数字游戏结束！`
                msg.needAt = false
                this.imService.internalRobotSendMsg(msg)
                this.channelId2BOMap.delete(channelId)
            } else if (+new Date >= +game.endTime) {
                this.logger.log(`channelId:${channelId} guess number game over. try clean.`)
                const msg: InternalRobotMsgBO = { ...game.msg }
                msg.desc = `猜数字游戏结束！`
                msg.needAt = false
                this.imService.internalRobotSendMsg(msg)
                this.channelId2BOMap.delete(channelId)
            } else {
                const second = Math.floor(((+game.endTime) - (+new Date)) / TimeUtil.ONE_SECOND_MILLS)
                if (0 < second && second <= 3) {
                    const msg: InternalRobotMsgBO = { ...game.msg }
                    msg.desc = `猜数字游戏倒计时剩余${second}秒~`
                    msg.needAt = false
                    this.imService.internalRobotSendMsg(msg)
                }
            }
        })
    }
}

class GameCache {
    msg: InternalRobotMsgBO
    min: number
    max: number
    currentMin: number
    currentMax: number
    createTime: Date
    endTime: Date
    keyNumber: number
    winUsername: string
    constructor(msg: InternalRobotMsgBO, min: number, max: number, durationSeconds: number) {
        this.msg = msg
        this.min = min
        this.max = max
        this.currentMin = min
        this.currentMax = max
        this.createTime = new Date()
        this.endTime = new Date()
        const t_s = this.endTime.getTime(); //转化为时间戳毫秒数
        this.endTime.setTime(t_s + TimeUtil.ONE_SECOND_MILLS * durationSeconds)
        this.keyNumber = this.randomNum(min, max)
        console.log({ keyNumber: this.keyNumber })
    }

    randomNum(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}