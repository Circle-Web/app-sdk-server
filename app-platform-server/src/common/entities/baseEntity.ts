import {
    CreateDateColumn, Entity, UpdateDateColumn
} from 'typeorm';

@Entity()
export class BaseEntity {

    @CreateDateColumn({
        name: 'CreateTime',
        nullable: false,
        type: 'datetime',
        comment: '添加时间',
    })
    createTime: Date

    @UpdateDateColumn({
        type: 'datetime',
        nullable: false,
        name: 'UpdateTime',
        comment: '更新时间',
    })
    updateTime: Date;
}
