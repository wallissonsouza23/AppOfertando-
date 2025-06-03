import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './entities/comment.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';


@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  async create(productId: string, userId: string, dto: CreateCommentDto) {

    const product = await this.productRepo.findOne({
      where: { id: parseInt(productId, 10) },
    });

    if (!product) throw new NotFoundException('Produto não encontrado');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const comment = this.commentRepo.create({
      text: dto.text,
      user,
      product,
    });

    return this.commentRepo.save(comment);
  }

  async findByProduct(productId: string) {

    return this.commentRepo.find({
      where: { product: { id: parseInt(productId, 10) } },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

  }

  async update(commentId: string, userId: string, dto: UpdateCommentDto) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) throw new NotFoundException('Comentário não encontrado');
    if (comment.user.id !== userId) throw new ForbiddenException('Sem permissão');

    comment.text = dto.text;
    return this.commentRepo.save(comment);
  }

  async remove(commentId: string, userId: string) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) throw new NotFoundException('Comentário não encontrado');
    if (comment.user.id !== userId) throw new ForbiddenException('Sem permissão');

    return this.commentRepo.remove(comment);
  }
}

