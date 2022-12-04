import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateExtDto } from '../dto/create-ext.dto';
import { UpdateExtDto } from '../dto/update-ext.dto';
import { ExtOperateService } from './ext-operate.service';

@Controller('api/extOperate')
export class ExtOperateController {
    constructor(
        private readonly extOperateService: ExtOperateService,
    ) { }

    // 用户创建插件
    @Post('/createExt')
    createExt(@Req() request, @Body() dto: UpdateExtDto) {
        return this.extOperateService.createExt(request.user.id, dto)
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

    // 提交测试
    @Post('versionCommitTest')
    versionCommitTest(@Req() request, @Body() extVersionId: number) {
        return this.extOperateService.versionCommitTest(request.user.id, extVersionId)
    }

    // 取消测试
    @Post('versionTestBack')
    versionTestBack(@Req() request, @Body() extVersionId: number) {
        return this.extOperateService.versionTestBack(request.user.id, extVersionId)
    }

    // 提交审核
    @Post('versionCommitJudge')
    versionCommitJudge(@Req() request, @Body() extVersionId: number) {
        return this.extOperateService.versionCommitJudge(request.user.id, extVersionId)
    }

    // 取消审核
    @Post('versionBackJudge')
    versionBackJudge(@Req() request, @Body() extVersionId: number) {
        return this.extOperateService.versionBackJudge(request.user.id, extVersionId)
    }

    // 提交线上
    @Post('versionCommitOnline')
    versionCommitOnline(@Req() request, @Body() extVersionId: number) {
        return this.extOperateService.versionCommitOnline(request.user.id, extVersionId)
    }

    // 取消线上版本
    @Post('versionBackOnline')
    versionBackOnline(@Req() request, @Body() extVersionId: number) {
        return this.extOperateService.versionBackOnline(request.user.id, extVersionId)
    }

}
