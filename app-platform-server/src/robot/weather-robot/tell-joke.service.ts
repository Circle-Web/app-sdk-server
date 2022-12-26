import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { RateLimitService } from 'src/common/rate-limit.service';
import { ImService } from 'src/im/im.service';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { InternalRobotMsgBO } from '../data/internalRobotMsg.bo';

@Injectable()
export class TellJokeService extends RateLimitService {

    private appkey: string
    constructor(
        private readonly httpService: HttpService,
        private readonly imService: ImService,
        private readonly configService: ConfigService,
    ) {
        super();
        this.appkey = this.configService.get("jisu.appkey")
    }

    tryTellJoke(msg: InternalRobotMsgBO) {
        if (!this.refreshRateLimit()) {
            return
        }
        this.getJoke().then(res => {
            if (res.error()) {
                return
            }
            msg.desc = res.getValue()
            this.imService.internalRobotSendMsg(msg)
        })
    }

    async getJoke() {
        const url = `https://${this.configService.get("jisu.xiaohua_url")}/xiaohua/text`
        const observable = this.httpService.get(url, {
            params: {
                pagenum: 1,
                pagesize: 1,
                sort: "addtime",
                appkey: this.appkey,
            }
        }).pipe(map((res) => {
            return res.data
        }))
        return lastValueFrom(observable).then((res: any) => {
            if (res.result) {
                return ResultFactory.success(res.result.list?.[0]?.content)
            }
            return ResultFactory.create(ResultCode.SEARCH_ERROR)
        }).catch(err => {
            return ResultFactory.create(ResultCode.SEARCH_ERROR, err)
        })
    }
}