import { FoodProps } from '../../types/FoodProps';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { CardHorizontalFood } from './food/index'; // Verifique o caminho

type TrendingFoodsProps = {
  title: string;
  emoji: string;
  label: string;
  category: string;
  action: () => void;
};

export function TrendingFoods({ title, emoji, category, action, label }: TrendingFoodsProps) {
  const [foods, setFoods] = useState<FoodProps[]>([]);

  useEffect(() => {
    async function getFoods() {
      try {
        const apiUrl = `http://172.20.10.2:3000/products?category=${category}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new TypeError('A resposta da API não é um array.');
        }

        const formattedData: FoodProps[] = data.map((item: any) => ({
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
      } catch (error) {
        console.error("Erro ao buscar alimentos:", error);
      }
    }

    getFoods();
  }, [category]);

  return (
    <View className="space-y-2 px-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-xl font-bold">{emoji} {title}</Text>

        {/* Botão Ver mais produtos */}
        <TouchableOpacity onPress={action}>
          <Text className="text-orange-600 font-semibold text-sm">{label}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={foods}
        keyExtractor={(item) => item.id.toString()} // caso id seja número
        renderItem={({ item }) => (
          <View className="mr-4">
            <CardHorizontalFood food={item} />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
