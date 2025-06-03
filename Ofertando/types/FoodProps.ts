// Ofertando/types/FoodProps.ts
export interface FoodProps {
  id: number; // Backend retorna number
  name: string;
  price: number;
  featured: boolean;
  category: string;
  image: string; //  (URL da imagem do produto)
  userLikePercentage: number; // para refletir a entidade Product.userLikePercentage
 

  market: { // Objeto aninhado para o mercado
    id: number;
    name: string;
    address: string;
    rating: number; // Avaliação em estrelas do mercado
    verified: boolean; // Status de verificado do mercado
  };
}