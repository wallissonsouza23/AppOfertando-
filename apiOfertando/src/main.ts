// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilitar CORS
  app.enableCors();

  // Usando o ValidationPipe globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Criar a pasta de uploads se não existir
  const uploadDir = join(__dirname, '..', 'uploads', 'avatars');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Diretório de uploads criado: ${uploadDir}`);
  }

  // Configurar para servir arquivos estáticos da pasta 'uploads/avatars'
  app.useStaticAssets(join(__dirname, '..', 'uploads', 'avatars'), {
    prefix: '/uploads/avatars/',
  });

  // Iniciando o servidor na porta definida
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();