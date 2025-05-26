// app/(tabs)/ofertas.tsx
import { View, Text, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { Header } from '~/components/header';
import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight;

export default function Ofertas() {
  return (
    <ScrollView
      style={{ flex: 1 }}
      className="bg-slate-200"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full px-4" style={{ marginTop: statusBarHeight + 8 }}>
        <Header />

        <View className="bg-orange-500 rounded-br-full h-36 justify-center px-4 mb-4">
          <Text className="text-white font-bold text-xl">Anuncie seu mercado no Ofertando!</Text>
          <Pressable className="bg-black px-4 py-2 mt-2 rounded-md w-28">
            <Text className="text-white text-xs font-bold text-center">COMEÇAR</Text>
          </Pressable>
        </View>

        <Text className="text-lg font-bold mb-3">Ofertas da Semana</Text>
        <View className="gap-3">
          <View className="bg-white p-3 rounded-xl shadow">
            <Text className="text-orange-500 font-bold">Oferta</Text>
            <Text>Pêra Verde - R$ 8,49 (de R$ 11,49)</Text>
            <Text className="text-green-600">92% de aprovação</Text>
            <Text className="text-xs text-gray-500">Promoção até 15/05</Text>
          </View>
          {/* Repita para mais ofertas */}
        </View>

        <Text className="text-lg font-bold mt-6 mb-2">Categorias</Text>
        <View className="flex-row gap-3 pb-6">
          <View className="bg-white p-4 rounded-xl items-center">
            <Text>Laticínios</Text>
          </View>
          <View className="bg-white p-4 rounded-xl items-center">
            <Text>Limpeza</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
