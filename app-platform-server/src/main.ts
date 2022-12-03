import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt.gurad';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new JwtAuthGuard());
  app.enableCors();
  await app.listen(3000);
  app.getUrl().then(v => {
    Logger.log(`${v} started.`)
  })
}
bootstrap();
