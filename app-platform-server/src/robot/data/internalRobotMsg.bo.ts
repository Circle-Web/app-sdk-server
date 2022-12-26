import { InternalRobotDO } from "../entities/internal-robot.entity"

export class InternalRobotMsgBO {
    username: string
    fromNickName: string
    internalRobot: InternalRobotDO
    channelId: string
    desc: string
    needAt: boolean
    constructor(username: string, fromNickName: string, internalRobot: InternalRobotDO, channelId: string, desc = "", needAt = true) {
        this.username = username
        this.fromNickName = fromNickName
        this.internalRobot = internalRobot
        this.channelId = channelId
        this.desc = desc
        this.needAt = needAt
    }
}