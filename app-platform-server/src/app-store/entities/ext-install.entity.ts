import { BaseEntity } from "src/common/entities/baseEntity"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('ext_install')
export class ExtInstallDO extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'Id',
        comment: '唯一id',
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
        name: 'ExtUuid',
        type: 'varchar',
        length: 255,
        comment: '插件唯一id'
    })
    extUuid: number
    @Column({
        name: 'UserId',
        type: 'varchar',
        length: 255,
        comment: '插件被安装的用户id',
    })
    userId: string
}
