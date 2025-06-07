import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common'; // ✅
import { Reflector } from '@nestjs/core'; // ✅
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );


  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const uploadDir = join(__dirname, '..', 'uploads', 'avatars');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Diretório de uploads criado: ${uploadDir}`);
  }

  app.useStaticAssets(join(__dirname, '..', 'uploads', 'avatars'), {
    prefix: '/uploads/avatars/',
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
