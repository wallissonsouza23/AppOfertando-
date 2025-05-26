// components/ProductCard.tsx
import { View, Text, Image } from 'react-native';
import React from 'react';

type Props = {
  produto: {
    id: string;
    nome: string;
    preco: string;
    mercado: string;
    imagem: string;
    avaliacao: string;
  };
};

export default function ProductCard({ produto }: Props) {
  return (
    <View className="w-40 mr-4 bg-orange-50 p-2 rounded-2xl">
      <Image
        source={{ uri: produto.imagem }}
        className="w-full h-24 rounded-lg"
        resizeMode="contain"
      />
      <Text className="text-sm font-bold mt-2">{produto.nome}</Text>
      <Text className="text-xs text-gray-500">{produto.mercado}</Text>
      <Text className="text-orange-600 font-semibold mt-1">
        R$ {produto.preco}
      </Text>
      <Text className="text-green-500 text-xs">{produto.avaliacao}</Text>
    </View>
  );
}
