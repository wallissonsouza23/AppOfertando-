import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Market } from './entities/market.entity';
import { Repository } from 'typeorm';
import { CreateMarketDto } from './dto/create-market.dto';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
  ) {}

  create(data: CreateMarketDto) {
    const market = this.marketRepository.create(data);
    return this.marketRepository.save(market);
  }

  findAll() {
    return this.marketRepository.find({ relations: ['products'] });
  }
}
