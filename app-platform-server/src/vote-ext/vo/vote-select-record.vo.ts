import { BaseEntity } from "src/common/entities/baseEntity";
import { VoteSelectRecordDO } from "../entities/vote-select-record.entity";

export class VoteSelectRecordVO extends BaseEntity {
    id: number
    userId: string
    select: number[]
    constructor(v: VoteSelectRecordDO) {
        super();
        this.id = v.id
        this.userId = v.userId
        this.select = JSON.parse(v.selectStr)
        this.createTime = v.createTime
        this.updateTime = v.updateTime
    }
}
