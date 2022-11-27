import {
    Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity('user')
export class UserDO {
    @PrimaryGeneratedColumn({
        name: 'Id',
        comment: '用户id',
    })
    id: number;

    @Column({
        name: 'Username',
        type: 'varchar',
        width: 255,
        comment: '用户名',
    })
    username: string;

    @Column({
        name: 'Account',
        type: 'varchar',
        width: 20,
        comment: '账号',
    })
    account: string;

    @Column({
        name: 'Password',
        type: 'varchar',
        width: 20,
        comment: '密码',
    })
    password: string;


    @Column({
        name: 'RoleId',
        width: 10,
        comment: '权限id，1 用户，2 管理员',
        default: 1,
    })
    roleId: number;

    @CreateDateColumn({
        name: 'CreatedTime',
        type: 'datetime',
        nullable: true,
        comment: '添加时间',
    })
    createdTime: Date;

    @UpdateDateColumn({
        name: 'UpdatedTime',
        type: 'datetime',
        nullable: true,
        comment: '更新时间',
    })
    updatedTime: Date;
}