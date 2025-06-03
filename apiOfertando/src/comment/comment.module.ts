import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from './entities/comment.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';

import { CommentsService } from './comment.service';
import { CommentsController } from './comment.controller';



@Module({
  imports: [TypeOrmModule.forFeature([Comment, Product, User])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentModule {}
