import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Market } from 'src/market/entities/market.entity';
import { ProductLike } from './entities/product-like.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductLike)
    private readonly productLikeRepository: Repository<ProductLike>,
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

  async findAll(category?: string, userId?: string): Promise<any[]> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.market', 'market');

    if (category) {
      queryBuilder.where('LOWER(product.category) = LOWER(:category)', { category });
    }

    const products = await queryBuilder.getMany();

    if (userId) {
      const userIdStr = String(userId);
      const likedProducts = await this.productLikeRepository.find({
        where: { user: { id: userIdStr } },
        relations: ['product'],
      });

      const likedIds = new Set(likedProducts.map((like) => like.product.id));

      return products.map((product) => ({
        ...product,
        isFavorited: likedIds.has(product.id),
      }));
    }

    return products;
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
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  async toggleLike(productId: number, user: User) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Produto não encontrado');

    const existing = await this.productLikeRepository.findOne({
      where: { product: { id: productId }, user: { id: user.id } },
      relations: ['product', 'user'],
    });

    if (existing) {
      await this.productLikeRepository.remove(existing);
      const totalLikes = await this.productLikeRepository.count({ where: { product: { id: productId } } });
      return { liked: false, totalLikes };
    }

    const like = this.productLikeRepository.create({ product, user });
    await this.productLikeRepository.save(like);
    const totalLikes = await this.productLikeRepository.count({ where: { product: { id: productId } } });
    return { liked: true, totalLikes };
  }

  async getFavoritesByUser(userId: string): Promise<Product[]> {
    const likes = await this.productLikeRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    return likes.map((like) => like.product);
  }


  async isProductFavoritedByUser(productId: number, userId: string): Promise<boolean> {
    const userIdStr = String(userId);
    const like = await this.productLikeRepository.findOne({
      where: { product: { id: productId }, user: { id: userIdStr } },
      relations: ['product', 'user'],
    });
    return !!like;
  }
}
