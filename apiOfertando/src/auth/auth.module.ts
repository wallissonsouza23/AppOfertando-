import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy'; // Caminho corrigido para a estratégia
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importe ConfigModule e ConfigService

@Module({
  imports: [
    // Registra a entidade User no AuthModule para o AuthService usar o Repository
    TypeOrmModule.forFeature([User]),
    PassportModule,
    // Configura o JwtModule de forma assíncrona para usar o ConfigService
    // Isso permite que o segredo JWT seja lido de variáveis de ambiente
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importe ConfigModule para poder injetar ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // OBTENDO O SEGREDO DE VARIÁVEL DE AMBIENTE
        signOptions: { expiresIn: '1h' }, // Token expira em 1 hora
      }),
      inject: [ConfigService], // Injete ConfigService aqui
    }),
    ConfigModule, // Certifique-se de que o ConfigModule está importado
    UserModule, // Importe UsersModule para que UsersService possa ser injetado no JwtStrategy
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    // REMOVA UserService daqui. Ele deve ser fornecido pelo UsersModule.
    // UserService,
  ],
  exports: [AuthService], // Exporte AuthService se ele for injetado em outros módulos
})
export class AuthModule { }