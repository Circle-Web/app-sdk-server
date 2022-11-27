import { Column } from "typeorm";

export class ExtTagDO {
    @Column({
        name: 'TagId',
        width: 20,
        comment: '标签的唯一id',
        primary: true,
    })
    tagId: number
    @Column({
        name: 'ExtUuidStr',
        width: 20,
        comment: '插件唯一id列表，#隔开',
    })
    extUuidStr: string
}