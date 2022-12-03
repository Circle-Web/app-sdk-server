import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppStoreModule } from './app-store/app-store.module';
import { ExtInstallDO } from './app-store/entities/ext-install.entity';
import { ExtMainDetailDO } from './app-store/entities/ext-main-detail.entity';
import { ExtVersionDO } from './app-store/entities/ext-version.entity';
import { ExtOperateModule } from './app-store/ext-operate/ext-operate.module';
import { ExtQueryModule } from './app-store/ext-query/ext-query.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/index';
import { ImModule } from './im/im.module';
import { TagService } from './tag/tag.service';
import { UserDO } from './user/entities/user.entity';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    //配置数据库链接
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          entities: [UserDO, ExtMainDetailDO, ExtVersionDO, ExtInstallDO],
          keepConnectionAlive: true,
          ...config.get('db.mysql'),
        } as TypeOrmModuleOptions;
      },
    }),
    ImModule,
    AuthModule,
    UserModule,
    AppStoreModule,
    ExtQueryModule,
    ExtOperateModule,
  ],
  controllers: [UserController],
  providers: [TagService],
})
export class AppModule { }
