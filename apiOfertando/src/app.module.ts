import { ServeStaticModule } from '@nestjs/serve-static';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config'; // Importe ConfigModule

import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Torna as variáveis de ambiente acessíveis globalmente
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Torna a pasta uploads acessível publicamente em /uploads
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // URL base: http://localhost:3000/uploads
    }),

    // Configuração do TypeORM usando o AppDataSource
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '782501',
      database: 'ofertando',
      // Melhor usar entities do data-source.ts ou listar explicitamente
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Isso pode funcionar, mas [User] ou AppDataSource.options.entities é mais explícito
      synchronize: false,
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }