import { Controller, Get, Post, Req } from '@nestjs/common';
import { QiNiuService } from './qi-niu.service';

@Controller('qiniu')
export class QiNiuController {
  constructor(private readonly qiNiuService: QiNiuService) { }

  @Get('token')
  getToken(@Req() request) {
    return this.qiNiuService.getToken(request.user.id)
  }

}
