import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppStoreModule } from './app-store/app-store.module';
import { ExtMainDetailDO } from './app-store/entities/ext-main-detail.entity';
import { ExtVersionDO } from './app-store/entities/ext-version.entity';
import { ExtOperateModule } from './app-store/ext-operate/ext-operate.module';
import { ExtQueryModule } from './app-store/ext-query/ext-query.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseConfig } from './config';
import { TagService } from './tag/tag.service';
import { UserDO } from './user/entities/user.entity';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfig.host,
      port: DatabaseConfig.port,
      username: DatabaseConfig.username,
      password: DatabaseConfig.password,
      database: DatabaseConfig.database,
      entities: [UserDO, ExtMainDetailDO, ExtVersionDO],
      synchronize: true,
    }),
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
