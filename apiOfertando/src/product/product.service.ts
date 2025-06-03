import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Market } from 'src/market/entities/market.entity';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create({
      name: dto.name,
      price: dto.price,
      featured: dto.featured ?? false,
      image: dto.image,
      category: dto.category,
      userLikePercentage: dto.userLikePercentage,
      market: { id: dto.marketId } as Market,
    });

    return await this.productRepository.save(product);
  }

  async findAll(category?: string): Promise<Product[]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.market', 'market');

    if (category) {
      queryBuilder.where('LOWER(product.category) = LOWER(:category)', { category });
    }

    return await queryBuilder.getMany();
  }

  async findFeatured(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { featured: true },
      relations: ['market'],
    });
  }
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['market'],
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }
}
