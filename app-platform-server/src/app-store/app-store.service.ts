import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { Repository } from 'typeorm';
import { ExtStatus } from './data/extStatus';
import { ExtVersionOnline } from './data/extVersionOnline';
import { ExtMainDetailDO } from './entities/ext-main-detail.entity';
import { ExtVersionDO } from './entities/ext-version.entity';

@Injectable()
export class AppStoreService {
  uninstallExt(extUuid: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(ExtMainDetailDO)
    private readonly rep: Repository<ExtMainDetailDO>,
    @InjectRepository(ExtVersionDO)
    private readonly versionRep: Repository<ExtVersionDO>,
  ) { }

  async getExtMainDetail(extUuid: number) {
    const data = await this.rep.findOne({
      where: { extUuid, extStatus: ExtStatus.ONLINE }
    })
    if (!data) {
      return ResultFactory.create(ResultCode.GET_EXT_FAIL_EXT_NOT_EXIST)
    }
    const { extName, extLogo, extMainUrl, extBrief, extDescription, extMarketSnapshots,
      keywords, extVersion, createTime, updateTime } =
      await this.versionRep.findOne({ where: { extUuid, extVersionOnline: ExtVersionOnline.ONLINE } })
    return ResultFactory.success({
      extName, extLogo, extMainUrl, extBrief, extDescription, extMarketSnapshots: extMarketSnapshots?.split("#") ?? [],
      keywords: keywords?.split("#") ?? [], extVersion, createTime, updateTime
    })
  }

  async getExtList(tagId: number, currentPage: number, pageSize: number) {
    return this.rep.createQueryBuilder()
      .where("tagId = :tagId", { tagId })
      .skip(pageSize * (currentPage - 1))
      .take(pageSize).getMany().then(data => {
        return ResultFactory.success(data)
      })
  }

  async findExtList(key: string) {
    const versionList =
      await this.versionRep.find({ where: { extVersionOnline: ExtVersionOnline.ONLINE } })
    return ResultFactory.success(versionList.filter(e => e.extName.includes(key)))
  }

}
