import { BaseEntity } from "src/common/entities/baseEntity"
import { RobotCreatedDO } from "../entities/robot-created.entity"

export class RobotVO extends BaseEntity {
    id: number
    userId: string
    robotNickname: string
    serverName: string
    channelId: string
    channelName: string
    webhook: string
    constructor(robot: RobotCreatedDO) {
        super()
        this.id = robot.id
        this.userId = robot.userId
        this.robotNickname = robot.robotNickname
        this.serverName = robot.serverName
        this.channelId = robot.channelId
        this.channelName = robot.channelName
        this.createTime = robot.createTime
        this.updateTime = robot.updateTime
    }
}