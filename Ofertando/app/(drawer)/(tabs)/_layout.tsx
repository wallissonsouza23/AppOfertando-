// app/(drawer)/(tabs)/_layout.tsx
import { Tabs } from 'expo-router/tabs';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Define a cor do ícone e do texto da aba ativa (selecionada)
        tabBarActiveTintColor: '#FF6600', // Use o código hexadecimal da sua cor laranja
        // Você também pode definir a cor da aba inativa, se quiser:
        // tabBarInactiveTintColor: 'gray', // Por exemplo, cinza para abas não selecionadas

        // Opcional: Estilo do contêiner da barra de abas
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // Cor de fundo da barra de abas
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0', // Cor da linha superior
        },
        // Opcional: Estilo do rótulo (texto) da aba
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        // Opcional: Estilo do contêiner do item da aba
        tabBarItemStyle: {
          // paddingVertical: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="ofertas"
        options={{
          title: 'Ofertas',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="tag" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}