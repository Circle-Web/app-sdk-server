import { Body, Controller, Post, Query } from '@nestjs/common';
import { ImMsg } from './dto/im-msg.dto';
import { ImService } from './im.service';

@Controller('/api/im')
export class ImController {
    constructor(private readonly imService: ImService) { }

    @Post('/robot/webhook/send')
    webhook(@Query() { key }, @Body() dto: ImMsg) {
        return this.imService.webhookSendMsg(key, dto)
    }
}
