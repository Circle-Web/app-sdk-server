import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtMainDetailDO } from '../entities/ext-main-detail.entity';
import { ExtVersionDO } from '../entities/ext-version.entity';
import { ExtOperateController } from './ext-operate.controller';
import { ExtOperateService } from './ext-operate.service';

@Module({
    controllers: [ExtOperateController],
    providers: [ExtOperateService],
    imports: [TypeOrmModule.forFeature([ExtMainDetailDO]), TypeOrmModule.forFeature([ExtVersionDO])],
})
export class ExtOperateModule { }
