import { Test, TestingModule } from '@nestjs/testing';
import { MarketService } from './market.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Market } from './entities/market.entity';
import { Repository } from 'typeorm';
import { CreateMarketDto } from './dto/create-market.dto';

describe('Serviço de Mercados (MarketService)', () => {
  let service: MarketService;
  let marketRepository: jest.Mocked<Repository<Market>>;

  const mockMarket: Market = {
    id: 1,
    name: 'Mercado Central',
    address: 'Rua das Laranjeiras',
    rating: 4.9,
    verified: true,
    products: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketService,
        {
          provide: getRepositoryToken(Market),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MarketService>(MarketService);
    marketRepository = module.get(getRepositoryToken(Market));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar e salvar um mercado', async () => {
      const dto: CreateMarketDto = {
        name: 'Mercado Central',
        address: 'Rua das Laranjeiras',
        rating: 4.9,
        verified: true,
        logo: 'logo.png',
        description: 'Mercado com grande variedade de produtos',
      };

      // Reaproveita mockMarket e ignora campos extras não existentes na entidade real
      marketRepository.create.mockReturnValue(mockMarket);
      marketRepository.save.mockResolvedValue(mockMarket);

      const result = await service.create(dto);
      expect(result).toEqual(mockMarket);
      expect(marketRepository.create).toHaveBeenCalledWith(dto);
      expect(marketRepository.save).toHaveBeenCalledWith(mockMarket);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os mercados com seus produtos', async () => {
      marketRepository.find.mockResolvedValue([mockMarket]);

      const result = await service.findAll();
      expect(result).toEqual([mockMarket]);
      expect(marketRepository.find).toHaveBeenCalledWith({ relations: ['products'] });
    });
  });
});
