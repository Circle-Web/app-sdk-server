import { BaseEntity } from "src/common/entities/baseEntity"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('ext_version')
export class ExtVersionDO extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'ExtVersionId',
        comment: '版本信息唯一id',
    })
    extVersionId: number
    @Column({
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
        name: 'ExtMainUrl',
        type: 'varchar',
        length: 255,
        comment: '插件入口网络地址',
        default: '',
    })
    extMainUrl: string
    @Column({
        name: 'ExtLogo',
        type: 'varchar',
        length: 255,
        comment: '插件logo地址url',
        default: '',
    })
    extLogo: string
    @Column({
        name: 'ExtBrief',
        type: 'varchar',
        length: 255,
        comment: '插件简要的介绍信息',
        default: '',
    })
    extBrief: string
    @Column({
        name: 'ExtDescription',
        type: 'varchar',
        width: 505,
        comment: '插件详细描述',
        default: '',
    })
    extDescription: string
    @Column({
        name: 'ExtMarketSnapshots',
        type: 'varchar',
        length: 255,
        comment: '插件快照图片url列表，#号隔开',
        default: '',
    })
    extMarketSnapshots: string
    @Column({
        name: 'Keywords',
        type: 'varchar',
        length: 255,
        comment: '关键词，#号隔开',
        default: '',
    })
    keywords: string
    @Column({
        name: 'ExtVersion',
        width: 20,
        comment: '插件版本',
        default: '0.0.0'
    })
    extVersion: string
    @Column({
        name: 'ExtVersionType',
        comment: '插件版本状态，1开发、2测试、3线上',
        default: '1'
    })
    extVersionType: number
    @Column({
        name: 'ExtVersionAudit',
        comment: '插件审核状态，1未审核、2审核中、3失败，4成功',
        default: '1'
    })
    extVersionAudit: number
    @Column({
        name: 'ExtVersionOnline',
        comment: '0 未上线，1上线',
        default: '0'
    })
    extVersionOnline: number
    @Column({
        name: 'ExtResourceMd5',
        width: 20,
        comment: '代码包资源md5',
        default: '0.0.0'
    })
    extResourceMd5: string
    @Column({
        name: 'ExtResourceUrl',
        width: 20,
        comment: '代码包资源路径',
        default: '0.0.0'
    })
    extResourceUrl: string
    @Column({
        name: 'ExtTestUrl',
        type: 'varchar',
        length: 255,
        comment: '插件测试路径入口网络地址',
        default: '',
    })
    extTestUrl: string
}