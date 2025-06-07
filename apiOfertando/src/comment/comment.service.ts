import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './entities/comment.entity';
import { CommentLike } from './entities/comment-like.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,

    @InjectRepository(CommentLike)
    private likeRepo: Repository<CommentLike>,

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

    if (dto.parentId) {
      const parent = await this.commentRepo.findOne({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException('Comentário pai não encontrado');
      comment.parentComment = parent;
    }

    return this.commentRepo.save(comment);
  }

  async findByProduct(productId: string, sort: 'newest' | 'oldest' = 'newest') {
    const order = sort === 'oldest' ? 'ASC' : 'DESC';
    return this.commentRepo.find({
      where: { product: { id: parseInt(productId, 10) } },
      order: { createdAt: order },
      relations: ['user'],
    });
  }

  async getLikedCommentIds(userId: string): Promise<string[]> {
    const likes = await this.likeRepo.find({
      where: { user: { id: userId } },
      relations: ['comment'],
    });
    return likes.map((like) => like.comment.id);
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
  async toggleLike(commentId: string, userId: string) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['likesList'],
    });
    if (!comment) throw new NotFoundException('Comentário não encontrado');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const existingLike = await this.likeRepo.findOne({
      where: { comment: { id: commentId }, user: { id: userId } },
    });

    if (existingLike) {
      await this.likeRepo.remove(existingLike);
    } else {
      const like = this.likeRepo.create({ comment, user });
      await this.likeRepo.save(like);
    }

    // Reconta as curtidas e atualiza o campo direto no comentário
    const likeCount = await this.likeRepo.count({
      where: { comment: { id: commentId } },
    });

    comment.likes = likeCount;
    await this.commentRepo.save(comment);

    return {
      id: commentId,
      likes: likeCount,
    };
  }


}
