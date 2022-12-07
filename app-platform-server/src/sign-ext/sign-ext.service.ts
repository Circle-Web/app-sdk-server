import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
import TimeUtil from 'src/utils/TimeUtil';
import { Repository } from 'typeorm';
import { SignRecordDO } from './entities/sign-record.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _ = require('lodash');

@Injectable()
export class SignExtService {

  constructor(
    @InjectRepository(SignRecordDO)
    private readonly signRecordDao: Repository<SignRecordDO>,
  ) {
  }

  async sign(serverId, username) {
    const recordList = await this.signRecordDao.find({ where: { serverId } })
    const ownRecordList = _.sortBy(recordList.filter(r => r.username == username), 'createTime')
    // 判断今天是否签到了
    let record: SignRecordDO
    if (ownRecordList.length) {
      record = ownRecordList[ownRecordList.length - 1]
      if (TimeUtil.isTodayDate(record.createTime)) {
        // 已签到
        return ResultFactory.create(ResultCode.SIGN_EXT_SIGN_FAIL)
      }
    }
    record = this.signRecordDao.create({serverId, username})
    record = await this.signRecordDao.save(record)
    ownRecordList.push(record)
    recordList.push(record)
    const todaySignPersonList = recordList.filter(r => TimeUtil.isTodayDate(r.createTime))
    const rankIndexToday = _.sortBy(todaySignPersonList, 'createTime').findIndex(r => r.username == username) + 1

    return ResultFactory.success({
      day: ownRecordList.length,
      signTime: record.createTime,
      ownRecordList,
      rankIndexToday
    })
  }

  async getInfo(serverId, username) {
    const recordList = await this.signRecordDao.find({ where: { serverId } })
    const _ownRecordList: SignRecordDO[] = _.sortBy(recordList.filter(r => r.username == username), 'createTime')
    const todaySignPersonList = recordList.filter(r => TimeUtil.isTodayDate(r.createTime))
    const rankIndexToday = _.sortBy(todaySignPersonList, 'createTime').findIndex(r => r.username == username) + 1
    const signTime = _ownRecordList?.[_ownRecordList.length - 1]?.createTime ?? TimeUtil.MAX_DATE
    const ownRecordList = []
    for (const iterator of _ownRecordList) {
      ownRecordList.push({ createTime: iterator.createTime })
    }
    return ResultFactory.success({
      day: ownRecordList.length,
      signTime: signTime,
      person: todaySignPersonList.length,
      ownRecordList,
      signToday: TimeUtil.isTodayDate(signTime),
      rankIndexToday
    })
  }

}
