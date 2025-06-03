import { IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsString()
  @IsOptional() // Assumindo que a imagem é opcional na criação
  image?: string;

  @IsString()
  @IsOptional() // Assumindo que a categoria é opcional na criação
  category?: string;

  @IsNumber()
  @IsOptional() // Assumindo que a porcentagem de like é opcional na criação
  userLikePercentage?: number;

  @IsNumber()
  @IsNotEmpty()
  marketId: number;
}