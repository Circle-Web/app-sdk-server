import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppStoreModule } from './app-store/app-store.module';
import { ExtOperateModule } from './app-store/ext-operate/ext-operate.module';
import { ExtQueryModule } from './app-store/ext-query/ext-query.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/index';
import { ImModule } from './im/im.module';
import { QiNiuModule } from './qiniu/qi-niu.module';
import { RobotExtModule } from './robot-ext/robot-ext.module';
import { SignExtModule } from './sign-ext/sign-ext.module';
import { TagService } from './tag/tag.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path")

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
          entities: [path.join(__dirname, './**/*.entity{.ts,.js}')],
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
    SignExtModule,
    QiNiuModule,
    RobotExtModule
  ],
  controllers: [UserController],
  providers: [TagService],
})
export class AppModule { }
