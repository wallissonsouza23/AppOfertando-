import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class Market {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 5.0 }) 
  rating: number; // Avaliação dos usuários para o mercado

  @Column({ default: false }) 
  verified: boolean;

  @OneToMany(() => Product, (product) => product.market)
  products: Product[];
}