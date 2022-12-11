
export class RobotBO {
    userId: string
    robotUsername: string
    robotNickname: string
    serverName: string
    channelId: string
    channelName: string
    webhook: string
    key: string
    constructor(userId: string, robotUsername: string, robotNickname: string, channelId: string, serverName: string, channelName: string, key: string) {
        this.userId = userId
        this.robotUsername = robotUsername
        this.robotNickname = robotNickname
        this.serverName = serverName
        this.channelId = channelId
        this.channelName = channelName
        this.key = key
    }
}