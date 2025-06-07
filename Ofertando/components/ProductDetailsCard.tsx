import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons, AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { FoodProps } from '../types/FoodProps';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';

export function CardHorizontalFood({ food }: { food: FoodProps }) {
  const router = useRouter();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      className="bg-orange-100 rounded-3xl p-4 mt-5 mx-4 shadow-md"
    >
      {/* ❤️ canto superior esquerdo */}
      <View className="absolute top-2 left-2 z-10">
        <AntDesign name="heart" size={16} color="red" />
      </View>

      {/* Data canto superior direito (pode adicionar futuramente) */}
      <View className="absolute top-2 right-3 z-10">
        <Text className="text-xs text-gray-500"></Text>
      </View>

      {/* Imagem do produto */}
      {food.image ? (
        <Image
          source={{ uri: food.image }}
          className="w-80 h-44 rounded-2xl mb-3 items-center justify-center"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-44 rounded-2xl bg-gray-300 items-center justify-center mb-2">
          <Text className="text-gray-600">Sem Imagem</Text>
        </View>
      )}

      {/* Avaliação por likes */}
      <View className="flex-row items-center space-x-2 mb-1">
        <AntDesign name="like1" size={14} color="#09aa09" />
        <Text className="text-green-700 font-bold text-sm">
          {food.userLikePercentage ?? 92}%
        </Text>
        <AntDesign name="dislike1" size={14} color="#f97316" />
      </View>

      {/* Nome + Mercado */}
      <Text className="font-bold text-lg text-black" numberOfLines={1}>
        {food.name}{' '}
        <Text className="text-orange-600" numberOfLines={1}>
          - {food.market.name}
        </Text>
      </Text>

      {/* Verificação e nota */}
      <View className="flex-row items-center mt-0.5 space-x-1">
        {food.market.verified && (
          <Feather name="check-circle" size={14} color="#09aa09" />
        )}
        <Ionicons name="star" size={14} color="#FFA500" />
        <Text className="text-gray-700 text-sm">
          {typeof food.market.rating === 'number'
            ? food.market.rating.toFixed(1)
            : '0.0'}
        </Text>
      </View>

      {/* Descrição (estática por enquanto) */}
      <Text className="text-orange-500 text-sm font-semibold mt-2">
        Descrição:{' '}
        <Text className="text-black font-normal">
          Refrigerante clássico, gelado é ideal para acompanhar refeições.
        </Text>
      </Text>

      {/* Detalhes técnicos (estáticos por enquanto) */}
      <View className="mt-1 space-y-0.5">
        <Text className="text-sm text-black">
          <Text className="font-semibold text-orange-500">Peso Líquido: </Text>
          250g
        </Text>
        <Text className="text-sm text-black">
          <Text className="font-semibold text-orange-500">Validade: </Text>
          23/07/2025
        </Text>
        <Text className="text-sm text-black">
          <Text className="font-semibold text-orange-500">Quantidade: </Text>
          760 em estoque
        </Text>
      </View>

      {/* Preço, vendidos e comentários (estáticos por enquanto) */}
      <View className="flex-row justify-between items-end mt-3">
        <View>
          <Text className="text-orange-600 font-bold text-2xl">
            R$ {(Number(food.price) || 5.49).toFixed(2).replace('.', ',')}
          </Text>
          <Text className="text-xs text-gray-600 mt-0.5">+811 vendidos</Text>
        </View>

        <View className="items-end">
          <FontAwesome name="star" size={22} color="black" />
          <View className="flex-row items-center mt-1">
            <Ionicons name="chatbubble-ellipses" size={14} color="#09aa09" />
            <Text className="text-green-700 text-sm ml-1">
              {food.comments?.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Botão "Comparar preço" funcional */}
      <Pressable
        onPress={() => router.push(``)}
        className="bg-orange-500 rounded-full py-2 px-4 mt-4 flex-row items-center justify-center"
      >
        <Text className="text-white font-bold text-base mr-2">Comparar preço</Text>
        <Ionicons name="arrow-forward" size={18} color="white" />
      </Pressable>
    </MotiView>
  );
}
