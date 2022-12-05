import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResultFactory } from 'src/utils/result/resultFactory';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const qiniu = require('qiniu')

@Injectable()
export class QiNiuService {
  private accessKey: string
  private secretKey: string
  private mac: any
  private options: any

  constructor(private readonly configService: ConfigService) {
    this.accessKey = this.configService.get('qiniu.accessKey')
    this.secretKey = this.configService.get('qiniu.secretKey')
    this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey)
    this.options = {
      scope: this.configService.get('qiniu.bucket')
    }
  }

  getToken(userId: number) {
    const putPolicy = new qiniu.rs.PutPolicy(this.options)
    const uploadToken = putPolicy.uploadToken(this.mac)
    return ResultFactory.success({ uploadToken, pictureKey: `${userId}_${+new Date}` })
  }

}
