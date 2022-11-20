import { Column, Entity } from "typeorm";

@Entity('admin')
export class AdminDO {
    @Column({
        name: 'Account',
        type: 'varchar',
        width: 20,
        primary: true,
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
}
