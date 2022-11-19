import { Injectable } from '@nestjs/common';
import { ResultFactory } from 'src/common/ResultFactory';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class LoginService {

  constructor(private readonly userService: UserService) { }

  async login(loginDto: LoginDto) {
    let exist = await this.userService.exist(loginDto.account, loginDto.password)
    if (!exist) {
      return ResultFactory.create(1);
    }
    return ResultFactory.success();
  }

}
