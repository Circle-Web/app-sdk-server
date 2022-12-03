import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity('ext_install')
export class ExtInstallDO {
    @PrimaryGeneratedColumn({
        name: 'Id',
        comment: '唯一id',
    })
    id: number
    @Column({
        name: 'ServerId',
        type: 'varchar',
        width: 255,
        comment: '社区id',
    })
    serverId: string
    @Column({
        name: 'ExtUuid',
        type: 'varchar',
        width: 255,
        comment: '插件唯一id'
    })
    extUuid: number
    @Column({
        name: 'UserId',
        type: 'varchar',
        width: 255,
        comment: '插件被安装的用户id',
    })
    userId: string
    @CreateDateColumn({
        name: 'CreatedTime',
        type: 'datetime',
        comment: '添加时间',
    })
    createTime: Date
    @UpdateDateColumn({
        name: 'UpdatedTime',
        type: 'datetime',
        comment: '更新时间',
    })
    updateTime: Date
}
