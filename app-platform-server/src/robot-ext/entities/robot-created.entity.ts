import { BaseEntity } from "src/common/entities/baseEntity"
import { Column, Entity } from "typeorm"
@Entity('robot_created')
export class RobotCreatedDO extends BaseEntity {
    @Column({
        name: 'Id',
        type: 'varchar',
        length: 100,
        comment: '唯一id',
        primary: true
    })
    id: string
    @Column({
        name: 'UserId',
        type: 'varchar',
        length: 255,
        comment: '机器人被创建的用户id',
    })
    userId: string
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
        name: 'ServerName',
        type: 'varchar',
        length: 255,
        comment: '社区名称',
    })
    serverName: string
    @Column({
        name: 'ChannelId',
        type: 'varchar',
        length: 255,
        comment: '频道Id',
    })
    channelId: string
    @Column({
        name: 'ChannelName',
        type: 'varchar',
        length: 255,
        comment: '频道名称',
    })
    channelName: string
    @Column({
        name: 'Webhook',
        type: 'varchar',
        length: 500,
        comment: 'webhook地址',
    })
    webhook: string
}