// app/inicio.tsx
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import React from 'react';
import ProductCard from '../../../components/ProductCard';
import { Header } from '~/components/header/index';
import Banner from '~/components/banner';
import PagerView from 'react-native-pager-view';
import Constants from 'expo-constants';
import { Search } from '~/components/search';
import { TrendingFoods } from '~/components/trending';
import 'react-native-gesture-handler';

import { useRouter } from 'expo-router';

const statusBarHeight = Constants.statusBarHeight

const banners = [
  require("../../../assets/11.png"),
  require("../../../assets/12.png"),
];
export default function Home() {

  const router = useRouter();
  return (

    <ScrollView
      style={{ flex: 1 }}
      className="bg-slate-200"
      showsVerticalScrollIndicator={false}>

      <View className="w-full px-4" style={{ marginTop: statusBarHeight + 8 }}>
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

        <Search />
        <Banner />
        <TrendingFoods
          title="Frutas"
          emoji="🍎"
          label="Mais produtos"
          category="Frutas"
          action={() => console.log("Ver mais frutas")}
        />

        <TrendingFoods
          title="Carnes"
          emoji="🍖"
          label="Mais produtos"
          category="Carnes"
          action={() => console.log("Ver mais carnes")}
        />

        <TrendingFoods
          title="Bebidas"
          emoji="🍸"
          label="Mais produtos"
          category="Bebidas"
          action={() => console.log("Ver mais bebidas")}
        />

        <TrendingFoods
          title="Laticínios"
          emoji="🧀"
          label="Mais produtos"
          category="Laticínios"
          action={() => console.log("Ver mais laticínios")}
        />

      </View>

    </ScrollView>
  );
}
