import { Module } from '@nestjs/common';
import { QiNiuService } from './qi-niu.service';
import { QiNiuController } from './qi-niu.controller';

@Module({
  controllers: [QiNiuController],
  providers: [QiNiuService]
})
export class QiNiuModule {}
