import { BaseEntity } from "src/common/entities/baseEntity";
import { Column, Entity } from "typeorm";

@Entity('vote_select_record')
export class VoteSelectRecordDO extends BaseEntity {
    @Column({
        name: 'Id',
        comment: '投票的唯一id',
        primary: true
    })
    id: number
    @Column({
        name: 'UserId',
        type: 'varchar',
        length: 255,
        comment: '参与投票的用户id',
        primary: true
    })
    userId: string
    @Column({
        name: 'SelectStr',
        type: 'varchar',
        length: 500,
        comment: '选择了的选项下标，从0开始，集合序列化',
    })
    selectStr: string
}
