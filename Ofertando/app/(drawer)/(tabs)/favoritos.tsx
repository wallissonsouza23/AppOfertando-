// app/(tabs)/favoritos.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import PagerView from 'react-native-pager-view';
import { Header } from '~/components/header';
import { useFavoriteProducts } from '../../../utils/useFavoriteProducts';
import { CardHorizontalFood } from '../../../components/trending/food';
import { FoodProps } from '../../../types/FoodProps';
import { useRouter } from 'expo-router';

const statusBarHeight = Constants.statusBarHeight;

const banners = [
  require("../../../assets/11.png"),
  require("../../../assets/12.png"),
];

export default function Favoritos() {

  const [tab, setTab] = useState<'Produtos' | 'Estabelecimentos'>('Produtos');
  const { favorites, loading, error, refetch } = useFavoriteProducts();
console.log('🟥 Dados brutos de favoritos:', favorites);

  // Sanitiza e deduplica os favoritos
 const validFavorites: FoodProps[] = favorites
  .filter((f) => {
    const valid = f && f.id && !isNaN(Number(f.id));
    if (!valid) console.warn('⚠️ Produto com ID inválido:', f);
    return valid;
  })
  .filter((v, i, arr) => arr.findIndex((o) => o.id === v.id) === i);

const router = useRouter();
  return (
    <ScrollView className="flex-1 bg-slate-200" showsVerticalScrollIndicator={false}>
      <View className="w-full px-4" style={{ marginTop: statusBarHeight + 8 }}>
        {/* Header */}
        <Header />

        {/* Banner rotativo */}
        <View className="w-full h-36 md:h-60 mb-3 bg-orange-500 rounded-br-full overflow-hidden">
          <PagerView style={{ flex: 1 }} initialPage={0} pageMargin={14}>
            {banners.map((img, index) => (
              <Pressable
                key={index}
                className="w-full h-36 md:h-60 rounded-2xl"
                onPress={() => console.log(`CLICOU NO BANNER ${index + 1}`)}
              >
                <Image
                  source={img}
                  className="w-full h-full rounded-br-full object-contain"
                  resizeMode="cover"
                />
                <Pressable
                  className="absolute bottom-4 left-4 bg-black/70 rounded-md px-4 py-2"
                  onPress={() => router.push('/modal')}
                >
                  <Text className="text-white font-bold text-xs">COMEÇAR</Text>
                </Pressable>
              </Pressable>
            ))}
          </PagerView>
        </View>

        {/* Tabs */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xl font-bold">Favoritos</Text>
          <Pressable onPress={refetch}>
            <Text className="text-orange-500 text-sm font-semibold">Atualizar</Text>
          </Pressable>
        </View>

        <View className="flex-row mb-4 bg-gray-200 rounded-xl p-1">
          {['Produtos', 'Estabelecimentos'].map((item) => (
            <Pressable
              key={item}
              onPress={() => setTab(item as 'Produtos' | 'Estabelecimentos')}
              className={`flex-1 items-center py-2 rounded-xl ${tab === item ? 'bg-orange-500' : ''}`}
            >
              <Text className={`${tab === item ? 'text-white font-bold' : 'text-gray-600'}`}>{item}</Text>
            </Pressable>
          ))}
        </View>

        {/* Conteúdo por aba */}
        {tab === 'Produtos' ? (
          <View className="gap-3 pb-6">
            {loading ? (
              <ActivityIndicator size="large" color="#FFA500" />
            ) : error ? (
              <Text className="text-red-500">{error}</Text>
            ) : validFavorites.length === 0 ? (
              <Text className="text-gray-500">Nenhum produto favoritado ainda.</Text>
            ) : (
              validFavorites.map((food) => (
                <CardHorizontalFood key={food.id} food={food} fromFavoritesScreen />
              ))
            )}
          </View>
        ) : (
          <View className="pb-6">
            <Text className="text-gray-500">Lista de estabelecimentos favoritos...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
