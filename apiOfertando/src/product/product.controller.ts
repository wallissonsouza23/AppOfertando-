import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  UseGuards,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    return this.productService.findAll(category);
  }

  @Get('featured')
  findFeatured() {
    return this.productService.findFeatured();
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  async getFavorites(@CurrentUser() user: User) {
    console.log('LOG Backend - Requisição para /products/favorites recebida.');
    console.log('LOG Backend - User:', user);
    if (!user?.id) throw new BadRequestException('ID do usuário inválido');
    return this.productService.getFavoritesByUser(user.id);
  }

  @Get('favorites/:id')
  @UseGuards(JwtAuthGuard)
  async isProductFavorited(
    @Param('id') idParam: string,
    @CurrentUser() user: User,
  ): Promise<{ isFavorite: boolean }> {
    const id = Number(idParam);
    if (isNaN(id)) throw new BadRequestException('ID inválido');
    const isFavorite = await this.productService.isProductFavoritedByUser(id, user.id);
    return { isFavorite };
  }

  @Patch(':id/like')
  @UseGuards(JwtAuthGuard)
  toggleLike(@Param('id') id: string, @CurrentUser() user: User) {
    return this.productService.toggleLike(Number(id), user);
  }

  // COLOQUE ESTE POR ÚLTIMO
  @Get(':id')
  findOne(@Param('id') id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('ID inválido');
    }
    return this.productService.findOne(numericId);
  }
}




