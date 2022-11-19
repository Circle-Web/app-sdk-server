import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginModule } from './login/login.module';
import { UserModule } from './user/user.module';
import { DatabaseConfig } from './config';
import { UserEntity } from './user/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfig.host,
      port: DatabaseConfig.port,
      username: DatabaseConfig.username,
      password: DatabaseConfig.password,
      database: DatabaseConfig.database,
      entities: [UserEntity],
      synchronize: true,
    }),
    LoginModule, UserModule],
})
export class AppModule { }
