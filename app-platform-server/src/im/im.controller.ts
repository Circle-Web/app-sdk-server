import { Body, Controller, Post, Query } from '@nestjs/common';
import { ImMsg } from './dto/im-msg.dto';
import { ImService } from './im.service';
import { BaiduTranslateService } from './translate.service';

@Controller('/api/im')
export class ImController {
    constructor(
        private readonly imService: ImService,
        private readonly translateService: BaiduTranslateService,
    ) { }

    @Post('/robot/webhook/send')
    webhook(@Query() { key }, @Body() dto: ImMsg) {
        return this.imService.webhookSendMsg(key, dto)
    }

    @Post('/translate')
    translate(@Body() { q, from, to }) {
        return this.translateService.translate(q, from, to)
    }
}
