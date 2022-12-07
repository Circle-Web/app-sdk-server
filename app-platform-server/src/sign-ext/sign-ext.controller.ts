import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SignExtService } from './sign-ext.service';

@Controller('api/ext/sign')
export class SignExtController {
  constructor(private readonly signExtService: SignExtService) { }

  @Get('info')
  getInfo(@Query() { serverId, username }) {
    return this.signExtService.getInfo(serverId, username);
  }

  @Post('sign')
  sign(@Body() { serverId, username }) {
    return this.signExtService.sign(serverId, username);
  }

}
