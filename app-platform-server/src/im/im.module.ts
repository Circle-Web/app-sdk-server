import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ImService } from './im.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        timeout: config.get('http.timeout')
      }),
      inject: [
        ConfigService
      ]
    }),

  ],
  providers: [ImService],
  exports: [ImService]
})
export class ImModule { }
