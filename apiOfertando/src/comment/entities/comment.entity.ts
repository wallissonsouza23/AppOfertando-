// comment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;


  @CreateDateColumn()
  createdAt: Date;
}
