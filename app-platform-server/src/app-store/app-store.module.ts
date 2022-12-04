import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImModule } from 'src/im/im.module';
import { TagService } from 'src/tag/tag.service';
import { AppStoreController } from './app-store.controller';
import { AppStoreService } from './app-store.service';
import { ExtInstallDO } from './entities/ext-install.entity';
import { ExtMainDetailDO } from './entities/ext-main-detail.entity';
import { ExtVersionDO } from './entities/ext-version.entity';

@Module({
  controllers: [AppStoreController],
  providers: [AppStoreService, TagService],
  imports: [ImModule, TypeOrmModule.forFeature([ExtMainDetailDO]), TypeOrmModule.forFeature([ExtVersionDO]), TypeOrmModule.forFeature([ExtInstallDO])],
})
export class AppStoreModule { }
