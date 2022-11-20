import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import { UserDO } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Result } from 'src/utils/result/result';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) { }

  // JWT验证 - Step 2: 校验用户信息
  async validateUser(account: string, password: string): Promise<Result<UserDO>> {
    const user = await this.usersService.findOne(account);
    // todo: 密码加密
    if (user && user.password == password) {
      return ResultFactory.success(user)
    }
    // 查无此人
    return ResultFactory.create(ResultCode.LOGIN_FAIL);
  }

  // JWT验证 - Step 3: 处理 jwt 签证
  async certificate(user: UserDO) {
    const payload = {
      id: user.id,
      username: user.username,
      account: user.account,
      roleId: user.roleId
    };
    try {
      const token = this.jwtService.sign(payload);
      return ResultFactory.success({ token });
    } catch (error) {
      return ResultFactory.create(ResultCode.SUCCESS);
    }
  }

}