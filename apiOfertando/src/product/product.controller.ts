import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  // ✅ Corrigido: aceita ?category como query param e usa findAll
  @Get()
  findAll(@Query('category') category?: string) {
    return this.productService.findAll(category);
  }

  @Get('featured')
  findFeatured() {
    return this.productService.findFeatured();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(Number(id));
  }
}
