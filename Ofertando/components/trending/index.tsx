import { View, FlatList, Text, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { CardHorizontalFood } from './food';

export interface FoodProps {
  id: string;
  name: string;
  price: number;
  time: string;
  delivery: number;
  rating: number;
  image: string;
  restaurantId: string;
  category: string;
}

interface TrendingFoodsProps {
  title: string;
  emoji: string;
  label: string;
  category: string;
  action: () => void;
}

export function TrendingFoods({ title, emoji, label, category, action }: TrendingFoodsProps) {
  const [foods, setFoods] = useState<FoodProps[]>([]);

  useEffect(() => {
    async function getFoods() {
      const response = await fetch(`http://192.168.1.5:3000/foods?category=${category}`);
      const data = await response.json();
      setFoods(data);
    }
    getFoods();
  }, [category]);

  return (
    <View className="mb-6">
      {/* Header - Título + Mais produtos */}
      <View className="flex flex-row items-center justify-between px-4">
        <Text className="text-lg font-bold my-4">
          {title} {emoji}
        </Text>

        <Pressable onPress={action}>
          <Text className="text-orange-500 font-semibold text-sm">
            {label} &gt;
          </Text>
        </Pressable>
      </View>

      {/* Lista horizontal de produtos */}
      <FlatList
        data={foods}
        renderItem={({ item }) => <CardHorizontalFood food={item} />}
        horizontal
        contentContainerStyle={{ gap: 14, paddingLeft: 16, paddingRight: 16 }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
