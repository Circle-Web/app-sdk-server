import { Module } from '@nestjs/common';
import { TagService } from 'src/tag/tag.service';
import { AppStoreController } from './app-store.controller';
import { AppStoreService } from './app-store.service';

@Module({
  controllers: [AppStoreController],
  providers: [AppStoreService, TagService],
})
export class AppStoreModule { }
