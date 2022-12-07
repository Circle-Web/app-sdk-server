import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteRecordDO } from './entities/vote-record.entity';
import { VoteSelectRecordDO } from './entities/vote-select-record.entity';
import { VoteExtController } from './vote-ext.controller';
import { VoteExtService } from './vote-ext.service';

@Module({
  imports: [TypeOrmModule.forFeature([VoteRecordDO, VoteSelectRecordDO])],
  controllers: [VoteExtController],
  providers: [VoteExtService]
})
export class VoteExtModule { }
