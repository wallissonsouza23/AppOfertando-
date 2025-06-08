// Ofertando/components/CardHorizontalFood.tsx
import { Pressable, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { FoodProps } from '../../../types/FoodProps';
import { useRouter } from 'expo-router';
import { useToggleFavorite } from '../../../utils/useToggleFavorite';

export function CardHorizontalFood({ food, fromFavoritesScreen = false }: { food: FoodProps; fromFavoritesScreen?: boolean }) {

  const router = useRouter();

  const numericId = Number(food?.id);
if (!food?.id || isNaN(numericId) || numericId <= 0) {
  console.warn('❗ ID inválido no produto:', food);
  return null;
}

const { isFavorite, toggleFavorite, loading } = fromFavoritesScreen
  ? { isFavorite: true, toggleFavorite: () => {}, loading: false }
  : useToggleFavorite(String(food.id));


  return (
    <TouchableOpacity onPress={() => router.push(`/product/${food.id}`)}>
      <View className="w-44 bg-orange-100 rounded-2xl p-2 relative">
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            if (!loading) toggleFavorite();
          }}
          disabled={loading}
          className="absolute top-2 left-2 z-10"
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Favoritar produto"
        >
          <AntDesign name={isFavorite ? 'heart' : 'hearto'} size={18} color="red" />
        </Pressable>

        {food.image ? (
          <Image
            source={{ uri: food.image }}
            className="w-full h-28 rounded-xl"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-28 rounded-xl bg-gray-300 items-center justify-center">
            <Text className="text-gray-600">Sem Imagem</Text>
          </View>
        )}

        <Text className="font-semibold text-base text-black mt-2" numberOfLines={1}>
          {food.name}
        </Text>

        <View className="flex-row items-center mt-0.5">
          <Text className="text-gray-700 text-sm" numberOfLines={1}>
            {food.market?.name ?? 'Mercado desconhecido'}
          </Text>
          {food.market?.verified && (
            <Feather name="check-circle" size={14} color="#09aa09" className="ml-1" />
          )}
          <Ionicons name="star" size={14} color="#FFA500" className="ml-1" />
          <Text className="text-gray-700 text-sm ml-0.5">
            {typeof food.market?.rating === 'number' ? food.market.rating.toFixed(1) : '0.0'}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mt-2">
          {typeof food.price === 'number' ? (
            <Text className="text-orange-500 font-semibold text-base">
              R$ {food.price.toFixed(2).replace('.', ',')}
              <Text className="text-gray-500 text-xs"> Kg</Text>
            </Text>
          ) : (
            <Text className="text-gray-400 italic text-sm">Preço não disponível</Text>
          )}

          {food.userLikePercentage !== undefined && (
            <View className="flex-row items-center">
              <AntDesign name="like1" size={14} color="#09aa09" />
              <Text className="text-green-700 text-sm ml-0.5">{food.userLikePercentage}%</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}