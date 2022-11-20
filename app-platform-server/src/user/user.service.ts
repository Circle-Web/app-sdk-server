import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDO } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserDO)
    private readonly userRepository: Repository<UserDO>,
  ) { }

  register(createUserDto: CreateUserDto) {
    this.userRepository.create(createUserDto);
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(account: string) {
    return this.userRepository.findOne({
      where: { account },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

}