import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { Result } from 'src/utils/result/result';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';

@Injectable()
export class WeatherRobotService {
    private static CITY_URL = 'weather.cityUrl'
    private static URL = 'weather.url'
    private static KEY = 'weather.key'
    constructor(private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    async search(keyword: string): Promise<Result<any>> {
        const cityRes = await this.getCity(keyword)
        if (cityRes.error()) {
            const desc = `哎呀，机器人无法查询该地点："${keyword}"`
            return ResultFactory.create(ResultCode.SEARCH_ERROR, { desc })
        }
        const location = cityRes.getValue()
        const weatherRes = await this.getWeather(location)
        if (weatherRes.error()) {
            const desc = `哎呀，机器人暂时提供天气查询服务~`
            return ResultFactory.create(ResultCode.SEARCH_ERROR, { desc })
        }
        const now = weatherRes.getValue()
        const desc = `地点：${keyword}，温度：${now?.temp}，风向：${now.windDir}，风力等级：${now.windScale}，相对湿度：${now.humidity}%`
        return ResultFactory.success({ desc })
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
