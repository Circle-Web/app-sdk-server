import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignRecordDO } from './entities/sign-record.entity';
import { SignExtController } from './sign-ext.controller';
import { SignExtService } from './sign-ext.service';

@Module({
  controllers: [SignExtController],
  providers: [SignExtService],
  imports: [TypeOrmModule.forFeature([SignRecordDO])]
})
export class SignExtModule { }
