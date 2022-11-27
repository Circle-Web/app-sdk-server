import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateExtDto } from '../dto/create-ext.dto';
import { UpdateExtDto } from '../dto/update-ext.dto';
import { ExtOperateService } from './ext-operate.service';

@Controller('extOperate')
export class ExtOperateController {
    constructor(
        private readonly extOperateService: ExtOperateService,
    ) { }

    // 用户创建插件
    @Post('/createExt')
    createExt(@Req() request, @Body() createExtDto: CreateExtDto) {
        return this.extOperateService.createExt(request.user.id, createExtDto.extName)
    }

    // 用户修改插件的上架状态
    @Post('/reOnlineExt')
    reOnlineExt(@Req() request, @Body() extUuid: number) {
        return this.extOperateService.reOnlineExt(request.user.id, extUuid)
    }

    @Post('/offlineExt')
    offlineExt(@Req() request, @Body() extUuid: number) {
        return this.extOperateService.offlineExt(request.user.id, extUuid)
    }

    // 用户创建版本
    @Post('/createVersion')
    createVersion(@Req() request, @Body() { extUuid, version }) {
        return this.extOperateService.createVersion(request.user.id, extUuid, version)
    }

    // 用户更新概要信息
    @Post('updateVersion')
    updateVersion(@Req() request, @Body() dto: UpdateExtDto) {
        return this.extOperateService.updateVersion(request.user.id, dto)
    }

}
