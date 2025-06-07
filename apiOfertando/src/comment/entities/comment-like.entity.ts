import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Comment } from './comment.entity';

@Entity()
@Unique(['user', 'comment'])
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.likesList, { onDelete: 'CASCADE' })
  comment: Comment;

  @CreateDateColumn()
  createdAt: Date;
}
