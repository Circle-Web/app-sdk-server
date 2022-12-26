import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { RateLimitService } from 'src/common/rate-limit.service';
import { ImService } from 'src/im/im.service';
import { Result } from 'src/utils/result/result';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { InternalRobotMsgBO } from '../data/internalRobotMsg.bo';

@Injectable()
export class WeatherRobotService extends RateLimitService {
    private static CITY_URL = 'weather.cityUrl'
    private static URL = 'weather.url'
    private static KEY = 'weather.key'
    constructor(
        private readonly httpService: HttpService,
        private readonly imService: ImService,
        private readonly configService: ConfigService,
    ) {
        super()
    }

    async trySearch(msg: InternalRobotMsgBO, keyword: string): Promise<Result<any>> {
        if (!this.refreshRateLimit()) {
            return
        }
        const cityRes = await this.getCity(keyword)
        if (cityRes.error()) {
            msg.desc = `哎呀，机器人无法查询该地点："${keyword}"`
            this.imService.internalRobotSendMsg(msg)
        }
        const location = cityRes.getValue()
        const weatherRes = await this.getWeather(location)
        if (weatherRes.error()) {
            msg.desc = `哎呀，机器人暂时提供天气查询服务~`
            this.imService.internalRobotSendMsg(msg)
        }
        const now = weatherRes.getValue()
        msg.desc = `地点：${keyword}，温度：${now?.temp}，风向：${now.windDir}，风力等级：${now.windScale}，相对湿度：${now.humidity}%`
        this.imService.internalRobotSendMsg(msg)
    }

    async getCity(cityName: string) {
        const url = `https://${this.configService.get(WeatherRobotService.CITY_URL)}/city/lookup`
        const observable = this.httpService.get(url, {
            params: {
                key: this.configService.get(WeatherRobotService.KEY),
                location: cityName
            }
        }).pipe(map((res) => {
            return res.data
        }))
        return lastValueFrom(observable).then((res: any) => {
            if (res.location?.length) {
                return ResultFactory.success(res.location[0].id)
            }
            return ResultFactory.create(ResultCode.SEARCH_ERROR)
        }).catch(err => {
            return ResultFactory.create(ResultCode.SEARCH_ERROR, err)
        })
    }

    async getWeather(location: string) {
        const url = `https://${this.configService.get(WeatherRobotService.URL)}/weather/now`
        const observable = this.httpService.get(url, {
            params: {
                key: this.configService.get(WeatherRobotService.KEY),
                location
            }
        }).pipe(map((res) => {
            return res.data
        }))
        return lastValueFrom(observable).then((res: any) => {
            if (res.now) {
                return ResultFactory.success(res.now)
            }
            return ResultFactory.create(ResultCode.SEARCH_ERROR)
        }).catch(err => {
            return ResultFactory.create(ResultCode.SEARCH_ERROR, err)
        })
    }
}
