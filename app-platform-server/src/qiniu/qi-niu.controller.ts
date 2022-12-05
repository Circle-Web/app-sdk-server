import { Controller, Get, Req } from '@nestjs/common';
import { QiNiuService } from './qi-niu.service';

@Controller('api/qiniu')
export class QiNiuController {
  constructor(private readonly qiNiuService: QiNiuService) { }

  @Get('token')
  getToken(@Req() request) {
    return this.qiNiuService.getToken(request.user.id)
  }

}
