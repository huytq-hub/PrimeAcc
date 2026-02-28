import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security & Data Sanitization
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const isProd = process.env.NODE_ENV === 'production';
  const defaultOrigins = ['http://localhost:3003', 'http://127.0.0.1:3003'];
  const envOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: envOrigins.length > 0 ? envOrigins : (isProd ? defaultOrigins : true),
    credentials: true,
  });
  
  const port = Number(process.env.PORT ?? 4000);
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen(port, host);
  console.log(`Backend is running on: ${await app.getUrl()}`);
}
bootstrap();
