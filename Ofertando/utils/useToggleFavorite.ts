// utils/useToggleFavorite.ts
import { useEffect, useState } from 'react';
import { api } from './api';

interface UseToggleFavoriteResult {
  isFavorite: boolean;
  toggleFavorite: () => Promise<void>;
  loading: boolean;
}

export function useToggleFavorite(productId: string): UseToggleFavoriteResult {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchFavoriteStatus() {
      const numericId = Number(productId);
      if (!productId || isNaN(numericId)) {
        console.warn('ID inválido ao verificar favorito:', productId);
        return;
      }

      try {
        const res = await api.get(`/products/favorites/${numericId}`);
        console.log(`Status de favorito para produto ${numericId}:`, res.data);
        if (isMounted && typeof res.data?.isFavorite === 'boolean') {
          setIsFavorite(res.data.isFavorite);
        }
      } catch (err: any) {
        console.error('Erro ao verificar favorito:', err?.response?.data || err.message);
      }
    }

    fetchFavoriteStatus();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  async function toggleFavorite() {
    const numericId = Number(productId);
    if (!productId || isNaN(numericId)) {
      console.warn('ID inválido ao favoritar:', productId);
      return;
    }

    setLoading(true);
    try {
      await api.patch(`/products/${numericId}/like`);
      setIsFavorite(prev => !prev);
    } catch (err: any) {
      console.error('Erro ao alternar favorito:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }

  return { isFavorite, toggleFavorite, loading };
}
