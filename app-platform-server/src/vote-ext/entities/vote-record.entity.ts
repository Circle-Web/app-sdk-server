import { BaseEntity } from "src/common/entities/baseEntity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('vote_record')
export class VoteRecordDO extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'Id',
        comment: '唯一id'
    })
    id: number
    @Column({
        name: 'Title',
        type: 'varchar',
        length: 300,
        comment: '投票主题',
    })
    title: string
    @Column({
        name: 'OptionStr',
        type: 'varchar',
        length: 500,
        comment: '选项列表, 数组序列化',
    })
    optionStr: string
    @Column({
        name: 'MultipleChoice',
        type: 'bool',
        comment: '是否是多选',
    })
    multipleChoice: boolean
    @Column({
        name: 'PublicResult',
        type: 'bool',
        comment: '是否公开结果',
    })
    publicResult: boolean
    @Column({
        name: 'UserId',
        type: 'varchar',
        length: 255,
        comment: '被创建的用户id',
    })
    userId: string
    @Column({
        name: 'Finish',
        type: 'bool',
        comment: '是否结束了',
        default: false
    })
    finish: boolean
}
