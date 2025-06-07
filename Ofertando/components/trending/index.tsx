import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { CardHorizontalFood } from './food/index';
import { FoodProps } from '../../types/FoodProps';
import { api } from '../../utils/api'; // ajuste o caminho se necessário

type TrendingFoodsProps = {
  title: string;
  emoji: string;
  label: string;
  category: string;
  action: () => void;
};

export function TrendingFoods({ title, emoji, category, action, label }: TrendingFoodsProps) {
  const [foods, setFoods] = useState<FoodProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFoods = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get(`/products`, {
        params: { category },
      });

      if (!Array.isArray(response.data)) {
        throw new Error('Resposta da API não é um array.');
      }

      const formattedData: FoodProps[] = response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        featured: item.featured,
        category: item.category,
        image: item.image,
        userLikePercentage: item.userLikePercentage,
        market: {
          id: item.market.id,
          name: item.market.name,
          address: item.market.address,
          rating: item.market.rating ? parseFloat(item.market.rating) : 0,
          verified: item.market.verified,
        },
      }));

      setFoods(formattedData);
    } catch (err: any) {
      console.error('Erro ao buscar alimentos:', err);
      setError(err.response?.data?.message || err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [category]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFoods();
  };

  return (
    <View className="space-y-2 px-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-xl font-bold">{emoji} {title}</Text>
        <TouchableOpacity onPress={action}>
          <Text className="text-orange-600 font-semibold text-sm">{label}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFA500" className="mt-4" />
      ) : error ? (
        <Text className="text-red-600 mt-2">Erro: {error}</Text>
      ) : foods.length === 0 ? (
        <Text className="text-gray-500 mt-2">Nenhum produto encontrado nesta categoria.</Text>
      ) : (
        <FlatList
          horizontal
          data={foods}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="mr-4">
              <CardHorizontalFood food={item} />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
