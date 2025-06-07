import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
import { CommentLike } from './comment-like.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment, { cascade: true })
  replies: Comment[];

  @OneToMany(() => CommentLike, (like) => like.comment, {
    cascade: true,
    eager: false, // NÃO colocar eager aqui — você controla via relations no serviço
  })
  likesList: CommentLike[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

@Column({ default: 0 })
likes: number;

}
