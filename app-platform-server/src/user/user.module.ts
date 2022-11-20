import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDO } from './entities/user.entity';
import { UserService } from './user.service';
@Module({
  imports: [TypeOrmModule.forFeature([UserDO]),],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
