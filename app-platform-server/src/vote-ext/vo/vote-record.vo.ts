import { BaseEntity } from "src/common/entities/baseEntity"
import { VoteRecordDO } from "../entities/vote-record.entity"

export class VoteRecordVO extends BaseEntity {
    id: number
    title: string
    option: string[]
    multipleChoice: boolean
    publicResult: boolean
    userId: string
    finish: boolean

    constructor(voteRecordDO: VoteRecordDO) {
        super()
        this.id = voteRecordDO.id
        this.title = voteRecordDO.title
        this.option = JSON.parse(voteRecordDO.optionStr)
        this.multipleChoice = voteRecordDO.multipleChoice
        this.publicResult = voteRecordDO.publicResult
        this.userId = voteRecordDO.userId
        this.finish = voteRecordDO.finish
        this.createTime = voteRecordDO.createTime
        this.updateTime = voteRecordDO.updateTime
    }
}
