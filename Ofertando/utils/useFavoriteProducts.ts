// utils/useFavoriteProducts.ts
import { useEffect, useState } from 'react';
import { api } from './api';
import { FoodProps } from '~/types/FoodProps';
import { useAuth } from './auth';

export function useFavoriteProducts() {
  const { getToken, loading: authLoading, user } = useAuth();
  const [favorites, setFavorites] = useState<FoodProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      console.log('LOG useFavoriteProducts - Token obtido:', token ? 'SIM' : 'NÃO');
      console.log('LOG useFavoriteProducts - User ID obtido:', user?.id);

      if (!token || !user) {
        console.warn('Token ou usuário ausente no useFavoriteProducts');
        setFavorites([]);
        return;
      }

      const response = await api.get('/products/favorites');
      if (Array.isArray(response.data)) {
        setFavorites(response.data);
      } else {
        throw new Error('Resposta inesperada do backend (esperava lista de produtos)');
      }

    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Erro desconhecido';
      console.error('Erro ao buscar favoritos:', msg);
      setError(`Erro ao carregar favoritos: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchFavorites();
    }
  }, [authLoading, user]);

  return {
    favorites,
    loading,
    error,
    refetch: fetchFavorites,
  };
}
