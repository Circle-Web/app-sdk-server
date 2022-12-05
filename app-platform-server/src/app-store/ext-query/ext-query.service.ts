import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { In, Repository } from 'typeorm';
import { ExtVersionType } from '../data/extVersionType';
import { ExtMainDetailDO } from '../entities/ext-main-detail.entity';
import { ExtVersionDO } from '../entities/ext-version.entity';
import { CreateExtQueryDto } from './dto/create-ext-query.dto';

@Injectable()
export class ExtQueryService {
  constructor(
    @InjectRepository(ExtMainDetailDO)
    private readonly rep: Repository<ExtMainDetailDO>,
    @InjectRepository(ExtVersionDO)
    private readonly versionRep: Repository<ExtVersionDO>,
  ) { }

  create(createExtQueryDto: CreateExtQueryDto) {
    return 'This action adds a new extQuery';
  }

  async findAll(extAuthorId: number, currentPage: number, pageSize: number) {
    if (currentPage <= 0 || pageSize <= 0) {
      return ResultFactory.create(ResultCode.PARAM_ERROR)
    }
    const mainDetailDOList = await this.rep.createQueryBuilder()
      .where("extAuthorId = :extAuthorId", { extAuthorId })
      .skip(pageSize * (currentPage - 1))
      .take(pageSize).getMany();
    const versionList = await this.versionRep.find({
      where: { extUuid: In(mainDetailDOList.map(d => d.extUuid)) }
    })
    return ResultFactory.success(_.unionBy(versionList, 'extUuid'));
  }

  async findOne(extAuthorId: number, extUuid: number) {
    const mainDetail = await this.rep.findOne({
      where: { extUuid, extAuthorId }
    })
    if (!mainDetail) {
      return ResultFactory.create(ResultCode.GET_EXT_FAIL_EXT_NOT_EXIST)
    }
    const { extName, extStatus, extLogo, createTime, updateTime } = mainDetail
    const versionList = await this.versionRep.find({
      where: { extUuid }
    })
    const onlineVersion = versionList.find(v => v.extVersionType == ExtVersionType.ONLINE)
    return ResultFactory.success({
      extUuid, extName, extStatus, extLogo, createTime, updateTime,
      extOnlineVersion: onlineVersion?.extVersion ?? ""
    })
  }

  async findAllVersion(extAuthorId: number, extUuid: number) {
    const data = await this.rep.findOne({
      where: { extUuid, extAuthorId }
    })
    if (!data) {
      return ResultFactory.create(ResultCode.GET_EXT_FAIL_EXT_NOT_EXIST)
    }
    const versionList = await this.versionRep.find({
      where: { extUuid }
    })
    return ResultFactory.success(versionList);
  }

}
