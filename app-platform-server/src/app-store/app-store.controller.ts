import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { IMRole } from 'src/im/data/role';
import { ImService } from 'src/im/im.service';
import { TagService } from 'src/tag/tag.service';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { AppStoreService } from './app-store.service';
import { ExtListDto } from './dto/ext-list.dto';

/**
 * 这里不用走鉴权
 */
@Controller('api/appstore')
export class AppStoreController {
  constructor(
    private readonly appStoreService: AppStoreService,
    private readonly tagService: TagService,
    private readonly imService: ImService
  ) { }

  @Get('tagList')
  tagList() {
    return this.tagService.findAllTagList();
  }

  @Get('extList')
  extList(@Query() query: ExtListDto) {
    return this.appStoreService.getExtList(query.tagId, query.currentPage, query.pageSize);
  }

  @Get('search')
  findExtList(@Query() key: string) {
    return this.appStoreService.findExtListResult(key);
  }

  @Get('extMainDetail')
  extMainDetail(@Query() extUuid: number) {
    return this.appStoreService.getExtMainDetail(extUuid)
  }

  @Get('installedExtList')
  installedExtList(@Body() { server_id }) {
    return this.appStoreService.installedExtList(server_id)
  }

  // 安装小程序
  @Post('installExt')
  async installExt(@Body() { server_id, user_id, extUuid }) {
    const res = await this.appStoreService.getExtMainDetail(extUuid)
    if (res.error()) {
      return res
    }
    const roleRes = await this.imService.getRole(server_id, user_id)
    if (roleRes.error()) {
      return roleRes
    }
    if (roleRes.getValue() !== IMRole.社区管理员) {
      return ResultFactory.create(ResultCode.IM_INSTALL_EXT_ROLE_FAIL)
    }
    return this.appStoreService.installExt(server_id, user_id, extUuid)
  }

  // 取消小程序
  @Post('uninstallExt')
  async uninstallExt(@Query() { server_id, user_id, extUuid }) {
    const res = await this.appStoreService.getExtMainDetail(extUuid)
    if (res.error()) {
      return res
    }
    const roleRes = await this.imService.getRole(server_id, user_id)
    if (roleRes.error()) {
      return roleRes
    }
    if (roleRes.getValue() !== IMRole.社区管理员) {
      return ResultFactory.create(ResultCode.IM_INSTALL_EXT_ROLE_FAIL)
    }
    return this.appStoreService.uninstallExt(server_id, user_id, extUuid)
  }
}
