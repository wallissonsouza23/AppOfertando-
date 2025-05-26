// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; // Importar este tipo
import * as fs from 'fs'; // Importar fs para criar diretório

// Inicializando o Firebase (mantenha sua configuração Firebase aqui)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Ou forneça o caminho para o arquivo de credenciais
  });
} else {
  admin.app(); // Se já tiver uma instância, usa a instância existente
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // Adicionar o tipo aqui

  // Habilitar CORS
  app.enableCors();

  // Usando o ValidationPipe globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true, // Adicionado para maior segurança em DTOs
    }),
  );

  // Criar a pasta de uploads se não existir
  const uploadDir = join(__dirname, '..', 'uploads', 'avatars');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Diretório de uploads criado: ${uploadDir}`);
  }

  // Configurar para servir arquivos estáticos da pasta 'uploads/avatars'
  // O prefixo '/uploads/avatars/' significa que para acessar um arquivo 'minhafoto.jpg'
  // dentro de 'uploads/avatars', a URL será 'http://localhost:3000/uploads/avatars/minhafoto.jpg'
  app.useStaticAssets(join(__dirname, '..', 'uploads', 'avatars'), {
    prefix: '/uploads/avatars/', // <--- E AQUI
  });

  // Iniciando o servidor na porta definida
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();