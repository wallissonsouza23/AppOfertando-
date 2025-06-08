import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';

import { ProductLike } from 'src/product/entities/product-like.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  telefone: string;

  @Column({ type: 'date', nullable: true }) // Isso faz com que o TypeORM armazene como YYYY-MM-DD
  dataNascimento: string; // E retorne como string YYYY-MM-DD

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;


  @OneToMany(() => ProductLike, (like) => like.user)
  likes: ProductLike[];

}