import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository, DeleteResult } from 'typeorm';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');
import * as bcrypt from 'bcrypt';

// Usuário simulado
const mockUser: Partial<User> = {
  id: '1',
  nome: 'Usuário Teste',
  email: 'teste@email.com',
  senha: 'hashedPassword',
  telefone: '123456789',
  avatarUrl: 'http://avatar.com',
  dataNascimento: '1990-01-01',
};

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('deve registrar um novo usuário', async () => {
      userRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      userRepository.create.mockReturnValue(mockUser as User);
      userRepository.save.mockResolvedValue(mockUser as User);

      const result = await service.register({
        nome: mockUser.nome!,
        email: mockUser.email!,
        senha: '123456',
        telefone: mockUser.telefone!,
        avatarUrl: mockUser.avatarUrl!,
        dataNascimento: mockUser.dataNascimento!,
      });

      expect(result).toHaveProperty('id');
      expect(result).not.toHaveProperty('senha');
    });

    it('deve lançar erro se o email já existir', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as User);

      await expect(
        service.register({
          nome: 'Teste',
          email: mockUser.email!,
          senha: '123456',
          telefone: '99999999',
          avatarUrl: '',
          dataNascimento: '1990-01-01',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('deve autenticar e retornar token', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign = jest.fn().mockReturnValue('fake-jwt');

      const result = await service.login({
        email: mockUser.email!,
        senha: '123456',
      });

      expect(result.token).toBe('fake-jwt');
      expect(result.user.email).toBe(mockUser.email);
    });

    it('deve lançar erro se senha for inválida', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: mockUser.email!, senha: 'errada' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('deve retornar o perfil do usuário', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as User);

      const result = await service.getProfile('1');
      expect(result.email).toBe(mockUser.email);
    });

    it('deve lançar erro se não encontrar o usuário', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('deve atualizar o perfil do usuário', async () => {
      const updateData = { nome: 'Novo Nome' };
      userRepository.findOne.mockResolvedValue(mockUser as User);
      userRepository.save.mockResolvedValue({ ...mockUser, ...updateData } as User);

      const result = await service.updateProfile('1', updateData);
      expect(result.nome).toBe(updateData.nome);
    });

    it('deve lançar erro se o usuário não existir', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.updateProfile('1', { nome: 'Novo' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAccount', () => {
    it('deve deletar o usuário com sucesso', async () => {
      userRepository.delete.mockResolvedValue({ affected: 1, raw: {} } as DeleteResult);

      const result = await service.deleteAccount('1');
      expect(result).toEqual({ message: 'Conta excluída com sucesso' });
    });

    it('deve lançar erro se o usuário não existir', async () => {
      userRepository.delete.mockResolvedValue({ affected: 0, raw: {} } as DeleteResult);

      await expect(service.deleteAccount('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('forgotPassword', () => {
    it('deve gerar token de redefinição e logar o link', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as User);
      jwtService.sign = jest.fn().mockReturnValue('reset-token');

      const result = await service.forgotPassword({ email: mockUser.email! });

      expect(result.message).toBe('Email enviado com instruções para redefinir a senha.');
    });

    it('deve lançar erro se o email não for encontrado', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.forgotPassword({ email: mockUser.email! })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('resetPassword', () => {
    it('deve redefinir a senha do usuário com token válido', async () => {
      jwtService.verify = jest.fn().mockReturnValue({ sub: mockUser.id });
      userRepository.findOne.mockResolvedValue(mockUser as User);
      (bcrypt.hash as jest.Mock).mockResolvedValue('novaSenhaHash');
      userRepository.save.mockResolvedValue(mockUser as User);

      const result = await service.resetPassword({
        token: 'valid-token',
        novaSenha: 'novaSenha123',
      });

      expect(result.message).toBe('Senha redefinida com sucesso');
    });

    it('deve lançar erro se o token for inválido ou expirado', async () => {
      jwtService.verify = jest.fn(() => {
        throw new Error('Token inválido');
      });

      await expect(
        service.resetPassword({ token: 'invalid', novaSenha: 'senha' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
