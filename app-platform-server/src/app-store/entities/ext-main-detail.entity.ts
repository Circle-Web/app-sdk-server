import { BaseEntity } from "src/common/entities/baseEntity"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('ext_main_detail')
export class ExtMainDetailDO extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'ExtUuid',
        comment: '插件唯一id',
    })
    extUuid: number
    @Column({
        name: 'ExtName',
        type: 'varchar',
        length: 255,
        comment: '插件名称',
    })
    extName: string
    @Column({
        name: 'ExtLogo',
        type: 'varchar',
        length: 255,
        comment: '插件logo地址url',
        default: ''
    })
    extLogo: string
    @Column({
        name: 'ExtAuthorId',
        comment: '插件的作者用户id',
    })
    extAuthorId: number
    @Column({
        name: 'ExtStatus',
        comment: '插件是否上架，0没上架，1上架',
        default: 0
    })
    extStatus: number
}
