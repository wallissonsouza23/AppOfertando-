import { Controller, Get, Post, Body } from '@nestjs/common';
import { MarketService } from './market.service';
import { CreateMarketDto } from './dto/create-market.dto';

@Controller('markets')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post()
  create(@Body() dto: CreateMarketDto) {
    return this.marketService.create(dto);
  }

  @Get()
  findAll() {
    return this.marketService.findAll();
  }
}
