import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentsService } from '../comment/comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('products/:productId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('productId') productId: string,
    @Body() dto: CreateCommentDto,
    @Req() req,
  ) {
    const userId = req.user.id; // obtido do JWT guard
    return this.commentsService.create(productId, userId, dto);
  }

  @Get()
  async findAll(@Param('productId') productId: string) {
    return this.commentsService.findByProduct(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.commentsService.update(id, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.commentsService.remove(id, userId);
  }
}
