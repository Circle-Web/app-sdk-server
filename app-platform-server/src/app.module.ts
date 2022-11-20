import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { AppStoreModule } from './app-store/app-store.module';
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
      entities: [UserDO],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    AppStoreModule,
    AdminModule,
  ],
  controllers: [AdminController, UserController],
  providers: [TagService],
})
export class AppModule { }
