import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom, map } from 'rxjs';
import { RobotCreatedDO } from 'src/robot-ext/entities/robot-created.entity';
import { Result } from 'src/utils/result/result';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { Repository } from 'typeorm';
import IMUser from './data/IMUser';
import { IMRole } from './data/role';
import { ImMsg } from './dto/im-msg.dto';

@Injectable()
export class ImService {

    private readonly logger = new Logger(ImService.name);
    private manager = new IMUser()

    constructor(private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @InjectRepository(RobotCreatedDO)
        private readonly dao: Repository<RobotCreatedDO>
    ) {
        // test
        this.getToken().then(res => this.logger.debug(`创建token：${res.getValue()}`))
    }

    private async getToken(): Promise<Result<any>> {
        if (new Date().getTime() > this.manager.createTime + this.manager.expires_in) {
            this.logger.debug(`环信token已过期，重新生成一个`)

            const url = `${this.configService.get('im.base_url')}/token`
            const observable = this.httpService.post(url, {
                grant_type: this.configService.get('im.grant_type'),
                client_id: this.configService.get('im.client_id'),
                client_secret: this.configService.get('im.client_secret'),
                ttl: this.configService.get('im.ttl')
            }, { headers: { 'Content-Type': 'application/json' } })
                .pipe(map((res) => {
                    return res.data
                }))

            return lastValueFrom(observable).then((data) => {
                this.manager.createTime = new Date().getTime()
                this.manager.access_token = data.access_token
                this.manager.application = data.application
                this.manager.expires_in = data.expires_in

                this.logger.debug(data.access_token)
                return ResultFactory.success(this.manager.access_token)
            }).catch(err => {
                return ResultFactory.create(ResultCode.IM_REQUEST_FAIL, { message: err.message, error_description: err.response.data })
            })
        }

        return ResultFactory.success(this.manager.access_token)
    }

    public async getRole(serverId: string, userId: string) {
        const res = await this.getToken()
        if (res.error()) {
            return res;
        }
        const url = `${this.configService.get('im.base_url')}/circle/server/${serverId}/user/role?userId=${userId}`
        const observable = this.httpService.get(url, {
            headers: this.getHeardes(res.getValue())
        }).pipe(map((res) => {
            return res.data
        }))
        return lastValueFrom(observable).then((data) => {
            return ResultFactory.success(data.role)
        }).catch(err => {
            return ResultFactory.create(ResultCode.IM_REQUEST_FAIL, { message: err.message, error_description: err.response.data })
        })
    }

    private getHeardes(token: string, contentType = 'application/json') {
        return {
            'Content-Type': contentType,
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    public async webhookSendMsg(key: string, imMsg: ImMsg) {
        // 解密key，拿到username
        const data = await this.dao.findOne({ where: { key } })
        if (!data) {
            return ResultFactory.create(ResultCode.IM_ROBOT_WEB_HOOK_FAIL)
        }
        imMsg.from = data.robotUsername
        imMsg.to = [`${data.channelId}`]

        const ext = JSON.parse(imMsg.ext)
        ext.nickname = data.robotNickname
        imMsg.ext = JSON.stringify(ext)
        return this.sendMsg(imMsg)
    }

    private async sendMsg(imMsg: ImMsg) {
        const url = `${this.configService.get('im.base_url')}/messages/chatgroups`
        const res = await this.getToken()
        if (res.error()) {
            return res
        }
        const observable = this.httpService.post(url,
            {
                ...imMsg
            },
            {
                headers: this.getHeardes(res.getValue())
            }).pipe(map((res) => {
                return res.data
            }))
        return lastValueFrom(observable).then((data) => {
            if (Object.keys(data.data).length) {
                return ResultFactory.success()
            }
            return ResultFactory.create(ResultCode.IM_REQUEST_FAIL)
        }).catch(err => {
            return ResultFactory.create(ResultCode.IM_REQUEST_FAIL, { message: err.message, error_description: err.response.data })
        })
    }

    public async internalRobotSendMsg(imMsg: ImMsg) {
        return this.sendMsg(imMsg)
    }

    async createRobot(username: string, robotName: string, serverId: string): Promise<Result<string>> {
        // 判断是否有权限
        const res = await this.getRole(serverId, username)
        if (res.error()) {
            return res
        }
        if (res.getValue() === IMRole.社区的普通成员) {
            return ResultFactory.create(ResultCode.IM_ROBOT_CREATE_ROLE_ERROR)
        }
        // 先创建一个
        const robotUsername = `${username}_${+new Date}`
        return this.regiesterIMUser(robotUsername, robotName)
    }

    public async regiesterIMUser(username: string, nickname: string): Promise<Result<any>> {
        const res = await this.getToken()
        if (res.error()) {
            return res
        }
        // 发送消息
        const url = `${this.configService.get('im.base_url')}/users`
        const observable = this.httpService.post(url,
            {
                username, password: username, nickname
            },
            {
                headers: this.getHeardes(res.getValue())
            }).pipe(map((res: any) => {
                return res.data
            }))
        return lastValueFrom(observable).then(() => {
            return ResultFactory.success(username)
        }).catch(err => {
            return ResultFactory.create(ResultCode.IM_REQUEST_FAIL, { message: err.message, error_description: err.response.data })
        })
    }

    public async setRobotTag(robotUsername: string, nickname: string, robotType: number) {
        const res = await this.getToken()
        if (res.error()) {
            return res
        }
        // 发送消息
        const url = `${this.configService.get('im.base_url')}/metadata/user/${robotUsername}`
        const observable = this.httpService.put(url,
            {
                nickname,
                robot: robotType
            },
            {
                headers: this.getHeardes(res.getValue(), 'application/x-www-form-urlencoded')
            }).pipe(map((res: any) => {
                this.logger.debug(`设置机器人标识 ${res.data}`)
                return res.data
            }))
        return lastValueFrom(observable).then(() => {
            return ResultFactory.success()
        }).catch(err => {
            return ResultFactory.create(ResultCode.IM_REQUEST_FAIL, { message: err.message, error_description: err.response.data })
        })
    }

    public async addRobotToServer(robotUsername: string, serverId: string, channelId: string): Promise<Result<{ serverName: string, channelName: string }>> {
        // 加入社区
        let res: any = await this.addServer(robotUsername, serverId)
        if (res.error()) {
            return res
        }
        const serverName = res.getValue()
        // 加入频道
        res = await this.addChannel(robotUsername, channelId, serverId)
        if (res.error()) {
            return res
        }
        const channelName = res.getValue()
        return ResultFactory.success({ serverName, channelName })
    }

    public async addServer(username: string, serverId: string) {
        const res = await this.getToken()
        if (res.error()) {
            return res
        }
        // 发送消息
        const url = `${this.configService.get('im.base_url')}/circle/server/${serverId}/join?userId=${username}`
        this.logger.debug(url)
        const observable = this.httpService.post(url,
            {},
            {
                headers: this.getHeardes(res.getValue())
            }).pipe(map((res) => {
                return res
            }))
        return lastValueFrom(observable).then((res) => {
            this.logger.debug(`已加入社区 ${res.data.server.name}`)
            return ResultFactory.success(res.data.server.name)
        }).catch(err => {
            return ResultFactory.create(ResultCode.IM_REQUEST_FAIL, { message: err.message, error_description: err.response.data })
        })
    }

    public async addChannel(username: string, channelId: string, serverId: string) {
        const res = await this.getToken()
        if (res.error()) {
            return res
        }
        // 发送消息
        const url = `${this.configService.get('im.base_url')}/circle/channel/${channelId}/join?userId=${username}&serverId=${serverId}`
        this.logger.debug(url)
        const observable = this.httpService.post(url,
            {},
            {
                headers: this.getHeardes(res.getValue())
            }).pipe(map((res) => {
                return res
            }))
        return lastValueFrom(observable).then((res) => {
            this.logger.debug(`已加入频道 ${res.data.channel.name}`)
            return ResultFactory.success(res.data.channel.name)
        }).catch(err => {
            return ResultFactory.create(ResultCode.IM_REQUEST_FAIL, { message: err.message, error_description: err.response.data })
        })
    }

    public createWebhook(key: string) {
        return `http://${this.configService.get('app.ip')}:${this.configService.get('app.port')}/api/im/robot/webhook/send?key=${key}`
    }
}
