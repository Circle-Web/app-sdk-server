import { BaseEntity } from "src/common/entities/baseEntity"
import { Column, Entity } from "typeorm"
@Entity('internal_robot')
export class InternalRobotDO extends BaseEntity {
    @Column({
        name: 'ServerId',
        type: 'varchar',
        length: 255,
        comment: '社区Id',
        primary: true
    })
    serverId: string
    @Column({
        name: 'ChannelId',
        type: 'varchar',
        length: 255,
        comment: '频道Id',
        primary: true
    })
    channelId: string
    @Column({
        name: 'RobotUsername',
        type: 'varchar',
        length: 255,
        comment: '机器人账号id',
    })
    robotUsername: string
    @Column({
        name: 'RobotNickname',
        type: 'varchar',
        length: 255,
        comment: '机器人名称',
    })
    robotNickname: string
    @Column({
        name: 'Key',
        type: 'varchar',
        length: 100,
        comment: 'webhook地址的key码',
    })
    key: string

}