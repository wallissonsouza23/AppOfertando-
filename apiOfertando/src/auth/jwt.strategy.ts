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

  async validate(payload: any) {
  
    // payload.sub contém o ID do usuário (UUID) que definimos no JWT payload
    const user = await this.userService.findById(payload.sub); 

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }
   
    const { senha, ...result } = user; // <-- Usar desestruturação para remover 'senha'
    return result; // O objeto user (sem a senha) será anexado a req.user
  }
}