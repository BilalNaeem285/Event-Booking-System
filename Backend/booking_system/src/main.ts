import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ============================
  // CORS (Frontend → Backend)
  // ============================
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // ============================
  // GLOBAL VALIDATION
  // ============================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // ============================
  // GLOBAL ERROR FILTER
  // ============================
  app.useGlobalFilters(new HttpExceptionFilter());

  // ============================
  // STATIC FILE SERVING (IMAGES)
  // ============================
  /**
   * Folder structure expected:
   * backend/
   * ├── uploads/
   * │   └── events/
   * │       └── image.jpg
   *
   * URL will be:
   * http://localhost:3001/uploads/events/image.jpg
   */
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  await app.listen(3001);
}

bootstrap();
