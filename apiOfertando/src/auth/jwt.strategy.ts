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
    // É uma boa prática buscar o usuário no DB para garantir que ele ainda existe e não foi desativado/excluído
    // payload.sub contém o ID do usuário (UUID) que definimos no JWT payload
    const user = await this.userService.findById(payload.sub); // <-- Usar findById (nome do método corrigido)

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }
    // Retorne o que você quer que seja anexado a `req.user`
    // Se a entidade User tiver um campo 'password'/'senha', delete-o antes de retornar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha, ...result } = user; // <-- Usar desestruturação para remover 'senha'
    return result; // O objeto user (sem a senha) será anexado a req.user
  }
}