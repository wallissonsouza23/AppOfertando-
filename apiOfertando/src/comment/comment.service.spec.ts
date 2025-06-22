import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CommentLike } from './entities/comment-like.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('Serviço de Comentários (CommentsService)', () => {
  let service: CommentsService;
  let commentRepo: jest.Mocked<Repository<Comment>>;
  let likeRepo: jest.Mocked<Repository<CommentLike>>;
  let productRepo: jest.Mocked<Repository<Product>>;
  let userRepo: jest.Mocked<Repository<User>>;

  const mockUser = {
    id: 'user1',
    nome: 'Usuário Teste',
    telefone: '999999999',
    dataNascimento: new Date('1990-01-01'),
    email: 'user1@test.com',
    senha: 'hashedpassword',
    created_at: new Date(),
    updated_at: new Date(),
    likes: [],
  } as unknown as User;

  const mockUserFull = {
    id: 'outroUser',
    nome: 'Nome Exemplo',
    telefone: '999999999',
    dataNascimento: new Date('1990-01-01'),
    email: 'outro@exemplo.com',
    senha: 'hash',
    created_at: new Date(),
    updated_at: new Date(),
    likes: [],
  } as unknown as User;

  const mockProduct = { id: 1 } as Product;

  const mockComment = {
    id: 'c1',
    text: 'Comentário',
    user: mockUser,
    product: mockProduct,
    createdAt: new Date(),
    likes: 0,
  } as unknown as Comment;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CommentLike),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
          },
        },
        { provide: getRepositoryToken(Product), useValue: { findOne: jest.fn() } },
        { provide: getRepositoryToken(User), useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentRepo = module.get(getRepositoryToken(Comment));
    likeRepo = module.get(getRepositoryToken(CommentLike));
    productRepo = module.get(getRepositoryToken(Product));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um comentário para produto existente', async () => {
      productRepo.findOne.mockResolvedValue(mockProduct);
      userRepo.findOne.mockResolvedValue(mockUser);
      commentRepo.create.mockReturnValue(mockComment);
      commentRepo.save.mockResolvedValue(mockComment);

      const result = await service.create('1', 'user1', { text: 'Olá' });
      expect(result).toEqual(mockComment);
    });

    it('deve lançar erro se produto não existir', async () => {
      productRepo.findOne.mockResolvedValue(null);
      await expect(service.create('999', 'user1', { text: 'teste' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByProduct', () => {
    it('deve retornar comentários ordenados por mais recentes', async () => {
      commentRepo.find.mockResolvedValue([mockComment]);
      const result = await service.findByProduct('1', 'newest');
      expect(result).toEqual([mockComment]);
    });
  });

  describe('update', () => {
    it('deve atualizar um comentário do usuário', async () => {
      commentRepo.findOne.mockResolvedValue({ ...mockComment, user: mockUser });
      commentRepo.save.mockResolvedValue({ ...mockComment, text: 'Atualizado' });
      const result = await service.update('c1', 'user1', { text: 'Atualizado' });
      expect(result.text).toBe('Atualizado');
    });

    it('deve lançar erro se não for o autor do comentário', async () => {
      commentRepo.findOne.mockResolvedValue({ ...mockComment, user: mockUserFull });
      await expect(service.update('c1', 'user1', { text: '...' })).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('deve remover um comentário do usuário', async () => {
      commentRepo.findOne.mockResolvedValue(mockComment);
      commentRepo.remove.mockResolvedValue(mockComment);
      const result = await service.remove('c1', 'user1');
      expect(result).toEqual(mockComment);
    });

    it('deve lançar erro se comentário não existir', async () => {
      commentRepo.findOne.mockResolvedValue(null);
      await expect(service.remove('999', 'user1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleLike', () => {
    it('deve curtir um comentário se ainda não curtido', async () => {
      commentRepo.findOne.mockResolvedValue({ ...mockComment, likesList: [] });
      userRepo.findOne.mockResolvedValue(mockUser);

      likeRepo.findOne.mockResolvedValue(null);

      likeRepo.create.mockReturnValue({
        id: '1',
        comment: mockComment,
        user: mockUser,
        createdAt: new Date(),
      } as unknown as CommentLike);

      likeRepo.save.mockResolvedValue({
        id: '1',
        comment: mockComment,
        user: mockUser,
        createdAt: new Date(),
      } as unknown as CommentLike);

      likeRepo.count.mockResolvedValue(1);
      commentRepo.save.mockResolvedValue({ ...mockComment, likes: 1 });

      const result = await service.toggleLike('c1', 'user1');
      expect(result).toEqual({ id: 'c1', likes: 1 });
    });

    it('deve remover curtida se já foi curtido', async () => {
      const existingLike = {
        id: '123',
        comment: mockComment,
        user: mockUser,
        createdAt: new Date(),
      } as unknown as CommentLike;

      commentRepo.findOne.mockResolvedValue({ ...mockComment, likesList: [existingLike] });
      userRepo.findOne.mockResolvedValue(mockUser);

      likeRepo.findOne.mockResolvedValue(existingLike);
      likeRepo.remove.mockResolvedValue(existingLike);
      likeRepo.count.mockResolvedValue(0);
      commentRepo.save.mockResolvedValue({ ...mockComment, likes: 0 });

      const result = await service.toggleLike('c1', 'user1');
      expect(result).toEqual({ id: 'c1', likes: 0 });
    });
  });
});
