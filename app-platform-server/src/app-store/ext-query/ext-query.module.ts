import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtMainDetailDO } from '../entities/ext-main-detail.entity';
import { ExtVersionDO } from '../entities/ext-version.entity';
import { ExtQueryController } from './ext-query.controller';
import { ExtQueryService } from './ext-query.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExtMainDetailDO]), TypeOrmModule.forFeature([ExtVersionDO])],
  controllers: [ExtQueryController],
  providers: [ExtQueryService],
  exports: [ExtQueryService]
})
export class ExtQueryModule { }
