import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDO } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserDO)
    private readonly userRepository: Repository<UserDO>,
  ) { }

  register(username: string, account: string, password: string) {
    const user = new UserDO()
    user.username = username
    user.account = account
    user.password = password
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(account: string) {
    return this.userRepository.findOne({
      where: { account },
    });
  }

}