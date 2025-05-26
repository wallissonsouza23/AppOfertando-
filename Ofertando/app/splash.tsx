import { View, Text, Image } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/'); // Redireciona para a tela principal (index.tsx)
    }, 2000); // 4 segundos de splash

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-slate-100">
      <Image
        source={require('../assets/logo.png')} // Substitua pelo caminho correto do logo
        style={{ width: 200, height: 200 }}
        resizeMode="contain"
      />
      <Text className="text-black text-3xl font-bold mt-4">Ofertando</Text>
    </View>
  );
};

export default SplashScreen;
