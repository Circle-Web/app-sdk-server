import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom, map } from "rxjs";
import { md5 } from "src/utils/cryptogram";
import { ResultCode } from "src/utils/result/resultCode";
import { ResultFactory } from "src/utils/result/resultFactory";

@Injectable()
export class BaiduTranslateService {
    private readonly logger = new Logger(BaiduTranslateService.name);
    private appid: string;
    private key: string;

    constructor(private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.appid = this.configService.get('translate.appid')
        this.key = this.configService.get('translate.key')
    }

    async translate(q: string, from: string, to: string) {
        const url = `https://${this.configService.get('translate.url')}`
        const salt = Math.floor(Math.random() * 10000000);
        const sign = md5(`${this.appid}${q}${salt}${this.key}`) //（签名）appid+q+salt+密钥的MD5值
        const urlencoded = new URLSearchParams();
        urlencoded.append("q", q);
        urlencoded.append("from", from);
        urlencoded.append("to", to);
        urlencoded.append("appid", this.appid);
        urlencoded.append("salt", salt.toString());
        urlencoded.append("sign", sign);
        urlencoded.append("tts", "");
        urlencoded.append("dict", "");
        urlencoded.append("action", "");
        const observable = this.httpService.post(url, urlencoded, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .pipe(map((res) => {
                return res.data
            }))
        return lastValueFrom(observable).then((data) => {
            if (data.error_code) {
                return ResultFactory.create(ResultCode.IM_REQUEST_FAIL, data)
            }
            const dst = data.trans_result[0].dst
            return ResultFactory.success({ dst })
        }).catch(err => {
            Logger.warn({ err })
            return ResultFactory.create(ResultCode.IM_REQUEST_FAIL, { message: err.error_code, error_description: err.error_msg })
        })
    }


}