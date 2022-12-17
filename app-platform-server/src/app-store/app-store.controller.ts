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
  findExtList(@Query() { key }) {
    return this.appStoreService.findExtListResult(key);
  }

  @Get('extMainDetail')
  extMainDetail(@Query() { extUuid }) {
    return this.appStoreService.getExtMainDetail(extUuid)
  }

  @Get('installedExtList')
  installedExtList(@Body() { serverId }) {
    return this.appStoreService.installedExtList(serverId)
  }

  // 安装小程序
  @Post('installExt')
  async installExt(@Body() { serverId, userId, extUuid }) {
    const res = await this.appStoreService.getExtMainDetail(extUuid)
    if (res.error()) {
      return res
    }
    const roleRes = await this.imService.getRole(serverId, userId)
    if (roleRes.error()) {
      return roleRes
    }
    if (roleRes.getValue() === IMRole.社区的普通成员) {
      return ResultFactory.create(ResultCode.IM_INSTALL_EXT_ROLE_FAIL)
    }
    return this.appStoreService.installExt(serverId, userId, extUuid)
  }

  // 取消小程序
  @Post('uninstallExt')
  async uninstallExt(@Query() { serverId, userId, extUuid }) {
    const res = await this.appStoreService.getExtMainDetail(extUuid)
    if (res.error()) {
      return res
    }
    const roleRes = await this.imService.getRole(serverId, userId)
    if (roleRes.error()) {
      return roleRes
    }
    if (roleRes.getValue() === IMRole.社区的普通成员) {
      return ResultFactory.create(ResultCode.IM_INSTALL_EXT_ROLE_FAIL)
    }
    return this.appStoreService.uninstallExt(serverId, userId, extUuid)
  }
}
