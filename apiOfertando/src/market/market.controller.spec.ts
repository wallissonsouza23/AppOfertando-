import { Test, TestingModule } from '@nestjs/testing';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MarketController', () => {
  let controller: MarketController;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketController],
      providers: [
        MarketService,
        {
          provide: getRepositoryToken(MarketEntity),
          useValue: mockMarketRepository,
        },
      ],
    }).compile();

    controller = module.get<MarketController>(MarketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
