import { Injectable } from '@nestjs/common';
import { ResultFactory } from 'src/utils/result/resultFactory';

@Injectable()
export class WeatherRobotService {
    async search(keyword: string) {
        return ResultFactory.success()
    }
}
