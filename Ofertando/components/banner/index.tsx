import { View, Pressable, Image } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useRef, useEffect, useState } from 'react';

export default function Banner() {
  const pagerRef = useRef<PagerView>(null);
  const [page, setPage] = useState(0);

  const totalPages = 2;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = (page + 1) % totalPages;
      pagerRef.current?.setPage(nextPage);
      setPage(nextPage);
    }, 5000); // troca a cada 5s

    return () => clearInterval(interval);
  }, [page]);

  return (
    <View className="w-full mt-3 mb-4">
      <View className="h-36 md:h-60 rounded-2xl overflow-hidden">
        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={(e) => setPage(e.nativeEvent.position)}
          pageMargin={14}
        >
          <Pressable
            key="1"
            onPress={() => console.log('CLICOU NO BANNER 1')}
          >
            <Image
              source={require('../../assets/1.png')}
              className="w-full h-36 md:h-60 object-cover"
            />
          </Pressable>
          <Pressable
            key="2"
            onPress={() => console.log('CLICOU NO BANNER 2')}
          >
            <Image
              source={require('../../assets/2.png')}
              className="w-full h-36 md:h-60 object-cover"
            />
          </Pressable>
            <Pressable
            key="3"
            onPress={() => console.log('CLICOU NO BANNER 2')}
          >
            <Image
              source={require('../../assets/3.png')}
              className="w-full h-36 md:h-60 object-cover"
            />
          </Pressable>
          <Pressable
            key="4"
            onPress={() => console.log('CLICOU NO BANNER 2')}
          >
            <Image
              source={require('../../assets/4.png')}
              className="w-full h-36 md:h-60 object-cover"
            />
          </Pressable>
          <Pressable
            key="5"
            onPress={() => console.log('CLICOU NO BANNER 2')}
          >
            <Image
              source={require('../../assets/5.png')}
              className="w-full h-36 md:h-60 object-cover"
            />
          </Pressable>

        </PagerView>
      </View>

      {/* Indicadores */}
      <View className="flex-row justify-center mt-2">
        {[...Array(totalPages).keys()].map((i) => (
          <View
            key={i}
            className={`w-2 h-2 rounded-full mx-1 ${
              i === page ? 'bg-orange-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>
    </View>
  );
}
