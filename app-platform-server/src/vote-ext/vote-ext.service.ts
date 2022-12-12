import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { Repository } from 'typeorm';
import { CreateVoteExtDto } from './dto/create-vote-ext.dto';
import { VoteRecordDO } from './entities/vote-record.entity';
import { VoteSelectRecordDO } from './entities/vote-select-record.entity';
import { VoteRecordVO } from './vo/vote-record.vo';
import { VoteSelectRecordVO } from './vo/vote-select-record.vo';

@Injectable()
export class VoteExtService {

  constructor(
    @InjectRepository(VoteRecordDO)
    private readonly voteRecordDao: Repository<VoteRecordDO>,
    @InjectRepository(VoteSelectRecordDO)
    private readonly voteSelectRecordDao: Repository<VoteSelectRecordDO>
  ) { }

  async create(createVoteExtDto: CreateVoteExtDto) {
    const { title, options, multipleChoice, publicResult, userId, channelId } = createVoteExtDto
    if (!options.length) {
      return ResultFactory.create(ResultCode.PARAM_ERROR)
    }
    let record = this.voteRecordDao.create({ title, optionStr: JSON.stringify(options), multipleChoice, publicResult, userId, channelId })
    record = await this.voteRecordDao.save(record)
    return ResultFactory.success({ record: new VoteRecordVO(record) })
  }

  async getMainRecord(id: number, userId: string) {
    if (isNaN(id)) {
      return ResultFactory.create(ResultCode.PARAM_ERROR)
    }
    const mainRecord = await this.voteRecordDao.findOne({ where: { id } })
    if (!mainRecord) {
      return ResultFactory.create(ResultCode.VOTE_EXT_NOT_EXIST)
    }
    const list = await this.voteSelectRecordDao.find({ where: { id } })

    return ResultFactory.success({
      mainRecord: new VoteRecordVO(mainRecord),
      list: list.map(l => new VoteSelectRecordVO(l)),
      selected: list.filter(l => l.userId === userId) !== null
    })
  }

  async getHistoryRecord(userId: string, channelId: string) {
    const mainRecordList = await this.voteRecordDao.find({ where: { userId, channelId } })
    return ResultFactory.success({ list: mainRecordList.map(o => new VoteRecordVO(o)) })
  }

  async select(id: number, select: number[], userId: string) {
    const set = new Set(select)
    if (set.size != select.length) {
      return ResultFactory.create(ResultCode.PARAM_ERROR)
    }
    const mainRecord = await this.voteRecordDao.findOne({ where: { id } })
    if (!mainRecord) {
      return ResultFactory.create(ResultCode.VOTE_EXT_NOT_EXIST)
    }
    if (mainRecord.finish) {
      return ResultFactory.create(ResultCode.VOTE_EXT_FINISHED)
    }
    if (!mainRecord.multipleChoice && select.length > 1) {
      return ResultFactory.create(ResultCode.VOTE_EXT_CAN_NOT_MULTIPLE_CHOICE)
    }
    const options: string[] = JSON.parse(mainRecord.optionStr)
    for (const index of select) {
      if (!options[index]) {
        return ResultFactory.create(ResultCode.PARAM_ERROR)
      }
    }
    let selectRecord = await this.voteSelectRecordDao.findOne({ where: { id, userId } })
    if (selectRecord) {
      return ResultFactory.create(ResultCode.VOTE_EXT_SELECTED)
    }
    selectRecord = this.voteSelectRecordDao.create({ id, selectStr: JSON.stringify(select), userId })
    await this.voteSelectRecordDao.save(selectRecord)
    return ResultFactory.success()
  }

  async close(id: number, userId: string) {
    const mainRecord = await this.voteRecordDao.findOne({ where: { id } })
    if (!mainRecord) {
      return ResultFactory.create(ResultCode.VOTE_EXT_NOT_EXIST)
    }
    if (mainRecord.userId !== userId) {
      return ResultFactory.create(ResultCode.VOTE_EXT_NOT_CREATEED_BY_USER)
    }
    if (mainRecord.finish) {
      return ResultFactory.create(ResultCode.VOTE_EXT_FINISHED)
    }
    mainRecord.finish = true
    await this.voteRecordDao.save(mainRecord)
    return ResultFactory.success()
  }

  remove(id: number) {
    return `This action removes a #${id} voteExt`;
  }
}
