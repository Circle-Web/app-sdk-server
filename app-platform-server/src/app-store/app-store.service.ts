import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { In, Repository } from 'typeorm';
import { ExtStatus } from './data/extStatus';
import { ExtVersionOnline } from './data/extVersionOnline';
import { ExtInstallDO } from './entities/ext-install.entity';
import { ExtMainDetailDO } from './entities/ext-main-detail.entity';
import { ExtVersionDO } from './entities/ext-version.entity';
// import _ from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _ = require('lodash')

@Injectable()
export class AppStoreService {

  constructor(
    @InjectRepository(ExtMainDetailDO)
    private readonly rep: Repository<ExtMainDetailDO>,
    @InjectRepository(ExtVersionDO)
    private readonly versionRep: Repository<ExtVersionDO>,
    @InjectRepository(ExtInstallDO)
    private readonly installRep: Repository<ExtInstallDO>,
  ) { }

  async getExtMainDetail(extUuid: number) {
    const data = await this.rep.findOne({
      where: { extUuid, extStatus: ExtStatus.ONLINE }
    })
    if (!data) {
      return ResultFactory.create(ResultCode.GET_EXT_FAIL_EXT_NOT_EXIST)
    }
    const versionData =
      await this.versionRep.findOne({ where: { extUuid, extVersionOnline: ExtVersionOnline.ONLINE } })
    if (!versionData) {
      return ResultFactory.create(ResultCode.GET_EXT_FAIL_EXT_NOT_EXIST)
    }
    const { extName, extLogo, extMainUrl, extBrief, extDescription, extMarketSnapshots,
      keywords, extVersion, createTime, updateTime } = versionData
    return ResultFactory.success({
      extName, extLogo, extMainUrl, extBrief, extDescription, extMarketSnapshots: extMarketSnapshots?.split("#") ?? [],
      keywords: keywords?.split("#") ?? [], extVersion, createTime, updateTime
    })
  }

  async getExtList(tagId: number, currentPage: number, pageSize: number) {
    return this.rep.createQueryBuilder()
      .where("tagId = :tagId", { tagId })
      .skip(pageSize * (currentPage - 1))
      .take(pageSize).getMany().then(list => {
        return ResultFactory.success({ list })
      })
  }

  async findExtListResult(key = "", extUuids: number[] = []) {
    const list = await this.findExtList(key, extUuids)
    return ResultFactory.success({ list })
  }

  async findExtList(key = "", extUuids: number[] = []) {
    let versionList: ExtVersionDO[]
    if (extUuids.length) {
      versionList = await this.versionRep.find({ where: { extUuid: In(extUuids), extVersionOnline: ExtVersionOnline.ONLINE } })
    } else {
      versionList = await this.versionRep.find({ where: { extVersionOnline: ExtVersionOnline.ONLINE } })
    }
    return versionList.filter(e => e.extName.includes(key))
  }

  async installedExtList(serverId: string) {
    const data = await this.installRep.find({
      where: { serverId }
    })
    const versionList = await this.findExtList("", data.map(d => d.id))
    const list = _.unionBy(versionList, 'extUuid')
    return ResultFactory.success({ list })
  }

  async installExt(serverId: string, userId: string, extUuid: number) {
    const data = await this.installRep.findOne({
      where: { serverId, userId, extUuid }
    })
    if (data) {
      return ResultFactory.create(ResultCode.IM_EXT_INSTALLED)
    }
    const installDO = this.installRep.create({ serverId, userId, extUuid })
    await this.installRep.save(installDO)
    return ResultFactory.success()
  }

  async uninstallExt(serverId: string, userId: string, extUuid: number) {
    const data = await this.installRep.findOne({
      where: { serverId, userId, extUuid }
    })
    if (!data) {
      return ResultFactory.create(ResultCode.IM_EXT_UNINSTALLED)
    }
    this.installRep.delete(data.id)
    return ResultFactory.success()
  }

}
