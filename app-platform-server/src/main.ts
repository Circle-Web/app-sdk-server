import { Logger } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
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
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpFilter())
  app.useGlobalGuards(new JwtAuthGuard());
  app.enableCors(corsOptions);
  await app.listen(3000);
  app.getUrl().then(v => {
    Logger.log(`${v} started.`)
  })
}
bootstrap();
Date.prototype.toJSON = function () {
  return this.getTime();
}
