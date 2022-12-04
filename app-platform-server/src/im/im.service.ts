import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
import IMUser from './data/IMUser';

@Injectable()
export class ImService {
    private readonly logger = new Logger(ImService.name);
    private manager = new IMUser()

    constructor(private readonly httpService: HttpService,
        private readonly configService: ConfigService) {
        // test
        // this.getToken().then(res => this.logger.debug(`${res.getValue()}`))
    }

    private async getToken() {
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
                    this.logger.debug(res.statusText)
                    return res.data
                }))
            const data = await lastValueFrom(observable)
            if (data) {
                this.manager.createTime = new Date().getTime()
                this.manager.access_token = data.access_token
                this.manager.application = data.application
                this.manager.expires_in = data.expires_in
            } else {
                return ResultFactory.create(ResultCode.IM_REQUEST_FAIL)
            }
        }

        return ResultFactory.success(this.manager.access_token)
    }

    public async getRole(server_id: number, user_id: number) {
        const res = await this.getToken()
        if (res.error()) {
            return res;
        }
        const path = `/server/${server_id}/user/role?userId=${user_id}`
        const observable = this.httpService.get(path, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${res.getValue()}`
            }
        }).pipe(map((res) => {
            return res.data
        }))
        const data = await lastValueFrom(observable)
        if (data && data.code === 200) {
            return ResultFactory.success(data.role)
        }
        return ResultFactory.create(ResultCode.IM_REQUEST_FAIL)
    }
}
