import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CommentLike } from '../comment/entities/comment-like.entity';
import { Repository, ObjectLiteral } from 'typeorm';

// Tipagem de mock melhorada
type MockType<T = any> = {
  [P in keyof T]?: jest.Mock<any>;
};

const createMockRepository = <T extends ObjectLiteral = any>(): MockType<Repository<T>> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: MockType<Repository<User>>;
  let mockCommentLikeRepository: MockType<Repository<CommentLike>>;

  beforeEach(async () => {
    mockUserRepository = createMockRepository<User>();
    mockCommentLikeRepository = createMockRepository<CommentLike>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(CommentLike), useValue: mockCommentLikeRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve criar um usuário', async () => {
    const dto = {
      nome: 'Wallisson',
      telefone: '61999999999',
      dataNascimento: '2000-01-01',
      email: 'teste@ex.com',
      avatarUrl: 'http://example.com/avatar.png',
      senha: '123456',
    };

    const fakeUser: User = {
      id: '',
      nome: dto.nome,
      telefone: dto.telefone,
      dataNascimento: dto.dataNascimento,
      email: dto.email,
      senha: dto.senha,
      avatarUrl: dto.avatarUrl,
      created_at: new Date(),
      updated_at: new Date(),
      likes: [],
    };

    const savedUser: User = {
      ...fakeUser,
      id: 'uuid-test',
    };

    mockUserRepository.create!.mockReturnValue(fakeUser);
    mockUserRepository.save!.mockResolvedValue(savedUser);

    const result = await service.create(dto as any);

    expect(mockUserRepository.create).toHaveBeenCalledWith(dto);
    expect(mockUserRepository.save).toHaveBeenCalledWith(fakeUser);
    expect(result).toEqual(savedUser);
  });

  it('deve retornar todos os usuários', async () => {
    const users: User[] = [
      { id: '1', nome: 'User1', telefone: '123', dataNascimento: '1990-01-01', email: 'u1@test.com', senha: '123', avatarUrl: '', created_at: new Date(), updated_at: new Date(), likes: [] },
      { id: '2', nome: 'User2', telefone: '456', dataNascimento: '1995-01-01', email: 'u2@test.com', senha: '456', avatarUrl: '', created_at: new Date(), updated_at: new Date(), likes: [] },
    ];

    mockUserRepository.find!.mockResolvedValue(users);

    const result = await service.findAll();
    expect(result).toEqual(users);
  });

  it('deve retornar um usuário pelo ID', async () => {
    const user: User = {
      id: '1',
      nome: 'User1',
      telefone: '123',
      dataNascimento: '1990-01-01',
      email: 'u1@test.com',
      senha: '123',
      avatarUrl: '',
      created_at: new Date(),
      updated_at: new Date(),
      likes: [],
    };

    mockUserRepository.findOne!.mockResolvedValue(user);

    const result = await service.findById('1');
    expect(result).toEqual(user);
  });

  it('deve lançar erro se o usuário não for encontrado', async () => {
    mockUserRepository.findOne!.mockResolvedValue(null);

    await expect(service.findById('non-existent-id')).rejects.toThrow('User with ID "non-existent-id" not found');
  });

  it('deve atualizar um usuário', async () => {
    const existingUser = {
      id: '1',
      nome: 'User1',
      telefone: '123',
      dataNascimento: '1990-01-01',
      email: 'u1@test.com',
      senha: '123',
      avatarUrl: '',
      created_at: new Date(),
      updated_at: new Date(),
      likes: [],
    };

    const updates = { nome: 'Novo Nome' };

    mockUserRepository.findOne!.mockResolvedValue(existingUser);
    mockUserRepository.save!.mockResolvedValue({ ...existingUser, ...updates });

    const result = await service.update('1', updates);
    expect(result.nome).toBe('Novo Nome');
  });

  it('deve remover um usuário', async () => {
    mockUserRepository.delete!.mockResolvedValue({ affected: 1 });

    await expect(service.remove('1')).resolves.toBeUndefined();
  });

  it('deve lançar erro ao tentar remover um usuário inexistente', async () => {
    mockUserRepository.delete!.mockResolvedValue({ affected: 0 });

    await expect(service.remove('non-existent-id')).rejects.toThrow('User with ID "non-existent-id" not found');
  });

  it('deve retornar os IDs dos comentários curtidos por um usuário', async () => {
    mockCommentLikeRepository.find!.mockResolvedValue([
      { comment: { id: 'c1' } },
      { comment: { id: 'c2' } },
    ]);

    const result = await service.getLikedCommentIds('1');
    expect(result).toEqual(['c1', 'c2']);
  });

});
