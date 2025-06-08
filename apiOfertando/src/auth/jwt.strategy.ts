import { Injectable, UnauthorizedException } from '@nestjs/common'; // <-- ADICIONADO UnauthorizedException
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService, // <-- CORRIGIDO para userService (singular)
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // ... dentro da JwtStrategy
  async validate(payload: any) {
    console.log('LOG JwtStrategy - Payload recebido:', payload);
    console.log('LOG JwtStrategy - ID do usuário (payload.sub):', payload.sub);

    // payload.sub contém o ID do usuário (UUID) que definimos no JWT payload
    const user = await this.userService.findById(payload.sub);

    if (!user) {
      console.error('ERRO JwtStrategy - Usuário não encontrado para ID:', payload.sub);
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const { senha, ...result } = user;
    console.log('LOG JwtStrategy - Usuário validado (sem senha):', result);
    return result; // O objeto user (sem a senha) será anexado a req.user
  }
}