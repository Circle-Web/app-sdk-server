import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagService } from 'src/tag/tag.service';
import { AppStoreController } from './app-store.controller';
import { AppStoreService } from './app-store.service';
import { ExtMainDetailDO } from './entities/ext-main-detail.entity';
import { ExtVersionDO } from './entities/ext-version.entity';
import { ExtOperateService } from './ext-operate/ext-operate.service';

@Module({
  controllers: [AppStoreController],
  providers: [AppStoreService, TagService, ExtOperateService],
  imports: [TypeOrmModule.forFeature([ExtMainDetailDO]), TypeOrmModule.forFeature([ExtVersionDO])],
})
export class AppStoreModule { }
