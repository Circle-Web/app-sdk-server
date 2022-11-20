import { Column } from "typeorm";

export class TagDO {
    @Column({
        name: 'Id',
        width: 20,
        comment: '标签的唯一id',
        primary: true,
    })
    id: number
    @Column({
        name: 'TagName',
        width: 20,
        comment: '标签名称',
        primary: true,
    })
    tagName: string
}