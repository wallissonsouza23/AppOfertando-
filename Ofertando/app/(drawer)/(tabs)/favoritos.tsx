// app/(tabs)/favoritos.tsx
import { View, Text, ScrollView, Pressable, Image, } from 'react-native';
import React, { useState } from 'react';
import { Header } from '~/components/header';
import Constants from 'expo-constants';
import PagerView from 'react-native-pager-view';

const statusBarHeight = Constants.statusBarHeight;

export default function Favoritos() {
  const [tab, setTab] = useState<'Produtos' | 'Estabelecimentos'>('Produtos');

  return (
    <ScrollView
      style={{ flex: 1 }}
      className="bg-slate-200"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full px-4" style= {{marginTop: statusBarHeight +8}}>
          <Header/>
          <View className="w-full h-36 md:h-60 mb-3 bg-orange-500 rounded-br-full ">
            <PagerView style={{flex:1}} initialPage={0} pageMargin={14}>
                    <Pressable className='w-full h-36 md:h-60 rounded-2xl'
                    key={1}
                    onPress={() => console.log("CLICOU NO BANNER 1")}>
                       <Image 
                  source={require("../../../assets/banner1.png")}
                  className='w-full h-auto md:h-60 rounded-br-full object-cover'/>
                        <Pressable 
                        className="absolute bottom-4 left-4 bg-black rounded-md px-4 py-2"
                        onPress={() => console.log("Clicou no Começar!")}
                      >
                        <Text className="text-white font-bold text-xs">COMEÇAR</Text>
                      </Pressable>
                    </Pressable>    
                </PagerView>
          </View>

        <Text className="text-xl font-bold mt-4 mb-2">Favoritos</Text>

        <View className="flex-row mb-4 bg-gray-200 rounded-xl p-1">
          <Pressable
            onPress={() => setTab('Produtos')}
            className={`flex-1 items-center py-2 rounded-xl ${tab === 'Produtos' ? 'bg-orange-500' : ''}`}
          >
            <Text className={`${tab === 'Produtos' ? 'text-white font-bold' : 'text-gray-600'}`}>Produtos</Text>
          </Pressable>
          <Pressable
            onPress={() => setTab('Estabelecimentos')}
            className={`flex-1 items-center py-2 rounded-xl ${tab === 'Estabelecimentos' ? 'bg-orange-500' : ''}`}
          >
            <Text className={`${tab === 'Estabelecimentos' ? 'text-white font-bold' : 'text-gray-600'}`}>Estabelecimentos</Text>
          </Pressable>
        </View>

        {tab === 'Produtos' ? (
          <View className="gap-3 pb-6">
            {/* Substitua por seu componente ProductCard */}
            <View className="bg-white p-3 rounded-xl shadow">
              <Text className="font-bold">Maçã Vermelha</Text>
              <Text>Mercado Maga</Text>
              <Text className="text-orange-500 font-bold">R$ 11,49</Text>
              <Text className="text-green-600">82% de aprovação</Text>
            </View>
          </View>
        ) : (
          <View>
            <Text>Lista de estabelecimentos favoritos...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
