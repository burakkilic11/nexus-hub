import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Angular uygulamamız 'localhost:4200' üzerinde çalışacağı için,
  // NestJS'e 'localhost:4200' adresinden gelen
  // isteklere izin vermesini ('origin') söylüyoruz.
  app.enableCors({
    origin: 'http://localhost:4200',
  });

  // NestJS varsayılan olarak 3000 portunda çalışır
  await app.listen(3000);
}
bootstrap().catch((err) => console.error('NestJS bootstrap failed', err));
