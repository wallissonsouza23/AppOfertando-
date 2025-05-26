// src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const userExists = await this.userRepository.findOne({ where: { email: dto.email } });
    if (userExists) {
      throw new BadRequestException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(dto.senha, 10);
    const user = this.userRepository.create({ ...dto, senha: hashedPassword });
    await this.userRepository.save(user);
    const { senha, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });

    if (!user || !(await bcrypt.compare(dto.senha, user.senha))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      nome: user.nome,
      avatarUrl: user.avatarUrl,
      telefone: user.telefone,
      // CORREÇÃO AQUI: Remover .toISOString().split('T')[0]
      // Se dataNascimento já é string, apenas use-a.
      // Se for Date, o TypeORM já pode ter formatado ou você precisa de `user.dataNascimento?.toISOString().split('T')[0]` se o campo fosse `Date | null`
      // Assumindo que `user.dataNascimento` já é uma string ou que você quer que ela vá como está.
      dataNascimento: user.dataNascimento,
    };
    const token = this.jwtService.sign(payload);

    const { senha, ...userWithoutPassword } = user;
    return {
      user: {
        ...userWithoutPassword,
        // CORREÇÃO AQUI: Remover .toISOString().split('T')[0]
        dataNascimento: user.dataNascimento, // Se já é string, use-a.
      },
      token
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const { senha, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, data: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    Object.assign(user, data);
    await this.userRepository.save(user);
    const { senha, ...result } = user;
    return result;
  }

  async deleteAccount(userId: string) {
    const result = await this.userRepository.delete(userId);
    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return { message: 'Conta excluída com sucesso' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload, { expiresIn: '30m' });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    console.log(`Link de redefinição de senha: ${resetLink}`);

    return { message: 'Email enviado com instruções para redefinir a senha.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const payload: any = this.jwtService.verify(dto.token);
      const user = await this.userRepository.findOne({ where: { id: payload.sub } });

      if (!user) throw new NotFoundException('Usuário não encontrado');

      user.senha = await bcrypt.hash(dto.novaSenha, 10);
      await this.userRepository.save(user);

      return { message: 'Senha redefinida com sucesso' };
    } catch (err) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}