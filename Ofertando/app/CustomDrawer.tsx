// app/CustomDrawer.tsx
import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../utils/auth';
import { useRouter } from 'expo-router';
import { API_BASE } from '../utils/api';



const ACTIVE_COLOR = '#FF6600';
const INACTIVE_COLOR = '#000';

export default function CustomDrawer(props: any) {
  const navigation = useNavigation();
  const route = useRoute();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout.');
    }
  };

  const isRouteActive = (routeName: string) => {
    if (routeName === '(tabs)') {
      return route.name === 'home' || route.name === 'ofertas' || route.name === 'favoritos' || route.name === 'perfil';
    }
    return route.name === routeName;
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <Image
          source={{
            // CONSTRUA A URL ABSOLUTA AQUI
            uri: user.avatarUrl
              ? `${API_BASE}${user.avatarUrl}` // SEM o cache-buster aqui para simplificar, mas você pode adicionar se quiser
              : 'https://i.pravatar.cc/100?img=1',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {user.nome || 'Usuário'}
        </Text>
        <Text style={styles.email}>
          {user.email || 'Email'}
        </Text>
      </View>

      <ScrollView style={styles.menu}>
        <TouchableOpacity
          style={[
            styles.item,
            isRouteActive('home') && styles.itemActive
          ]}
          onPress={() => router.navigate('/(drawer)/(tabs)/home')}
        >
          <Ionicons
            name="home"
            size={22}
            color={isRouteActive('home') ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
          <Text
            style={[
              styles.label,
              isRouteActive('home') ? styles.labelActive : null
            ]}
          >
            Início
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.item,
            isRouteActive('ofertas') && styles.itemActive
          ]}
          onPress={() => router.navigate('/(drawer)/(tabs)/ofertas')}
        >
          <Ionicons
            name="pricetag"
            size={22}
            color={isRouteActive('ofertas') ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
          <Text
            style={[
              styles.label,
              isRouteActive('ofertas') ? styles.labelActive : null
            ]}
          >
            Ofertas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.item,
            isRouteActive('favoritos') && styles.itemActive
          ]}
          onPress={() => router.navigate('/(drawer)/(tabs)/favoritos')}
        >
          <Ionicons
            name="heart"
            size={22}
            color={isRouteActive('favoritos') ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
          <Text
            style={[
              styles.label,
              isRouteActive('favoritos') ? styles.labelActive : null
            ]}
          >
            Favoritos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.item,
            isRouteActive('perfil') && styles.itemActive
          ]}
          onPress={() => router.navigate('/(drawer)/(tabs)/perfil')}
        >
          <Ionicons
            name="person"
            size={22}
            color={isRouteActive('perfil') ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
          <Text
            style={[
              styles.label,
              isRouteActive('perfil') ? styles.labelActive : null
            ]}
          >
            Perfil
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logout}>
          <MaterialIcons name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

// ... (seus estilos permanecem os mesmos) ...
const styles = StyleSheet.create({
  loadingContainer: { // Mantenha este estilo caso precise
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40, marginBottom: 10,
  },
  name: {
    fontWeight: 'bold', fontSize: 18, color: '#333',
  },
  email: {
    fontSize: 14, color: 'gray',
  },
  menu: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: '#f8f8f8',
  },
  itemActive: {
    backgroundColor: '#FF660020',
  },
  label: {
    marginLeft: 15,
    fontSize: 16,
    color: INACTIVE_COLOR,
    fontWeight: '500',
  },
  labelActive: {
    color: ACTIVE_COLOR,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6600',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});