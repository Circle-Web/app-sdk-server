import { Controller, Get, Query } from '@nestjs/common';
import { TagService } from 'src/tag/tag.service';
import { AppStoreService } from './app-store.service';
import { ExtListDto } from './dto/ext-list.dto';

/**
 * 这里不用走鉴权
 */
@Controller('appstore')
export class AppStoreController {
  constructor(
    private readonly appStoreService: AppStoreService,
    private readonly tagService: TagService,
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
    return this.appStoreService.findExtList(key);
  }

  @Get('extMainDetail')
  extMainDetail(@Query() extUuid: number) {
    return this.appStoreService.getExtMainDetail(extUuid)
  }

}
