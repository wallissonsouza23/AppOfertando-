import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Market } from 'src/market/entities/market.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: false })
  featured: boolean;

  @Column({ nullable: true }) // URL da imagem do produto
  image: string;

  @Column({ nullable: true }) // Categoria do produto (para o filtro que você já tem no frontend)
  category: string;

  @Column({ type: 'int', default: 0 }) // Porcentagem de "like" do produto. Use 'default' se começar com 0.
  userLikePercentage: number; // Nome sugestivo para diferenciar do rating do mercado

  // --- RELAÇÃO COM MARKET ---
  @ManyToOne(() => Market, (market) => market.products, { eager: true })
  market: Market;
}