import { Logger } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt.gurad';
import { HttpFilter } from './common/filter';

const corsOptions: CorsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const ip = configService.get<string>('app.ip');
  const port = configService.get<string>('app.port', "80");

  app.useGlobalFilters(new HttpFilter())
  app.useGlobalGuards(new JwtAuthGuard());
  app.enableCors(corsOptions);
  app.useStaticAssets('static')
  await app.listen(port);
  Logger.log(`${ip}:${port} server started.`)
}
bootstrap();
Date.prototype.toJSON = function () {
  return this.getTime();
}
