import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductLike } from './entities/product-like.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Market } from 'src/market/entities/market.entity';
import { CreateProductDto } from './dto/create-product.dto';

describe('Serviço de Produtos (ProductService)', () => {
  let service: ProductService;
  let productRepository: jest.Mocked<Repository<Product>>;
  let productLikeRepository: jest.Mocked<Repository<ProductLike>>;

  const mockUser: User = {
    id: 'user-1',
    nome: 'João',
    telefone: '61999999999',
    dataNascimento: '2000-01-01',
    email: 'joao@example.com',
    senha: 'senha123',
    created_at: new Date(),
    updated_at: new Date(),
    likes: [],
  };

  const mockMarket: Market = {
    id: 1,
    name: 'Mercado Central',
    address: 'Rua das Laranjeiras',
    rating: 4.8,
    verified: true,
    products: [],
  };

  const mockProduct: Product = {
    id: 1,
    name: 'Arroz',
    price: 10.99,
    featured: true,
    image: 'imagem.jpg',
    category: 'Alimento',
    userLikePercentage: 80,
    market: mockMarket,
    likes: [],
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([mockProduct]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(ProductLike),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get(getRepositoryToken(Product));
    productLikeRepository = module.get(getRepositoryToken(ProductLike));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('Criar Produto', () => {
    it('deve criar e retornar um produto', async () => {
      const dto: CreateProductDto = {
        name: 'Arroz',
        price: 10.99,
        image: 'imagem.jpg',
        category: 'Alimento',
        featured: true,
        marketId: 1,
      };

      productRepository.create.mockReturnValue(mockProduct);
      productRepository.save.mockResolvedValue(mockProduct);

      const result = await service.create(dto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('Buscar Todos os Produtos', () => {
    it('deve retornar todos os produtos', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockProduct]);
      expect(productRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('Buscar Produto por ID', () => {
    it('deve retornar um produto pelo ID', async () => {
      productRepository.findOne.mockResolvedValue(mockProduct);
      const result = await service.findOne(mockProduct.id);
      expect(result).toEqual(mockProduct);
    });

    it('deve lançar exceção se o produto não existir', async () => {
      productRepository.findOne.mockResolvedValue(undefined as any);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Buscar Produtos em Destaque', () => {
    it('deve retornar produtos destacados (featured)', async () => {
      productRepository.find.mockResolvedValue([mockProduct]);
      const result = await service.findFeatured();
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('Favoritar e Desfavoritar Produto', () => {
    it('deve favoritar um produto se ainda não estiver favoritado', async () => {
      productRepository.findOne.mockResolvedValue(mockProduct);
      productLikeRepository.findOne.mockResolvedValue(null);

      const mockProductLike: ProductLike = {
        id: 1,
        product: mockProduct,
        user: mockUser,
      };

      productLikeRepository.create.mockReturnValue(mockProductLike);
      productLikeRepository.save.mockResolvedValue(mockProductLike);
      productLikeRepository.count.mockResolvedValue(1);

      const result = await service.toggleLike(mockProduct.id, mockUser);
      expect(result).toEqual({ liked: true, totalLikes: 1 });
    });

    it('deve remover curtida se já estiver curtido', async () => {
      const mockProductLike: ProductLike = {
        id: 1,
        product: mockProduct,
        user: mockUser,
      };

      productRepository.findOne.mockResolvedValue(mockProduct);
      productLikeRepository.findOne.mockResolvedValue(mockProductLike);
      productLikeRepository.remove.mockResolvedValue(mockProductLike);
      productLikeRepository.count.mockResolvedValue(0);

      const result = await service.toggleLike(mockProduct.id, mockUser);
      expect(result).toEqual({ liked: false, totalLikes: 0 });
    });

    it('deve lançar exceção se o produto não existir', async () => {
      productRepository.findOne.mockResolvedValue(undefined as any);
      await expect(service.toggleLike(999, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Buscar Produtos Favoritos de um Usuário', () => {
    it('deve retornar produtos favoritados por um usuário', async () => {
      const mockProductLike: ProductLike = {
        id: 1,
        product: mockProduct,
        user: mockUser,
      };

      productLikeRepository.find.mockResolvedValue([mockProductLike]);
      const result = await service.getFavoritesByUser(mockUser.id);
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('Verificar se Produto está Favoritado por Usuário', () => {
    it('deve retornar true se o produto estiver favoritado', async () => {
      productLikeRepository.findOne.mockResolvedValue({
        id: 1,
        product: mockProduct,
        user: mockUser,
      });

      const result = await service.isProductFavoritedByUser(mockProduct.id, mockUser.id);
      expect(result).toBe(true);
    });

    it('deve retornar false se o produto não estiver favoritado', async () => {
      productLikeRepository.findOne.mockResolvedValue(null);
      const result = await service.isProductFavoritedByUser(mockProduct.id, mockUser.id);
      expect(result).toBe(false);
    });
  });
});
