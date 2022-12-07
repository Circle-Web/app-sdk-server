import { BaseEntity } from "src/common/entities/baseEntity"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('sign_record')
export class SignRecordDO extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'Id',
        comment: '自增id',
    })
    id: number
    @Column({
        name: 'ServerId',
        type: 'varchar',
        length: 255,
        comment: '社区id',
    })
    serverId: string
    @Column({
        name: 'Username',
        type: 'varchar',
        length: 255,
        comment: '社区唯一账号',
    })
    username: string
}
