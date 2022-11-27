import { Controller, Get, Query, Req } from '@nestjs/common';
import { PageParam } from 'src/common/dto/page.dto';
import { ExtQueryService } from './ext-query.service';

@Controller('extQuery')
export class ExtQueryController {
  constructor(private readonly extQueryService: ExtQueryService) { }

  // 查询自己旗下的小程序列表信息
  @Get('listExt')
  findAll(@Req() request, @Query() query: PageParam) {
    return this.extQueryService.findAll(request.user.id, query.currentPage, query.pageSize);
  }

  // 查询指定的小程序概要信息
  @Get('extMainDetail')
  findOne(@Req() request, @Query() extUuid: number) {
    return this.extQueryService.findOne(request.user.id, extUuid);
  }

  // 查询指定的小程序版本信息
  @Get('versionList')
  versionList(@Req() request, @Query() extUuid: number) {
    return this.extQueryService.findAllVersion(request.user.id, extUuid);
  }


}
