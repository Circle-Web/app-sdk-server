import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';

@Injectable()
export class WeatherRobotService {
    private cityUrl = ""
    private url = ""
    private key = ""
    constructor(private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.cityUrl = this.configService.get('weather.cityUrl')
        this.url = this.configService.get('weather.url')
        this.key = this.configService.get('weather.key')
    }
    async search(keyword: string) {
        const url = `${this.cityUrl}/`
        const observable = this.httpService.get(url).pipe(map((res) => {
                return res.data
        }))
        return lastValueFrom(observable).then((data) => {
            if (Object.keys(data.data).length) {
                return ResultFactory.success()
            }
            return ResultFactory.create(ResultCode.SEARCH_ERROR)
        }).catch(err => {
            return ResultFactory.create(ResultCode.SEARCH_ERROR, err)
        })
    }
}
