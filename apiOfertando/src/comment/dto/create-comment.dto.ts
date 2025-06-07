// src/comment/dto/create-comment.dto.ts
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
