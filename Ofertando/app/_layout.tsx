// app/_layout.tsx
import '../global.css';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../utils/auth';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useRouter, SplashScreen } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { user, loading } = useAuth(); // Agora do seu utils/auth.ts
  const router = useRouter();

  useEffect(() => {
    // ADICIONE ESTE LOG AQUI:
    console.log("AuthContext User Object:", user);
    console.log("AuthContext Loading State:", loading);

    if (!loading) { // Verifica se o AuthProvider terminou de carregar
      SplashScreen.hideAsync();
      if (user) {
        // Se há um usuário, redireciona para a área autenticada
        console.log('Usuário logado encontrado, redirecionando para / (drawer)');
        router.replace('/(drawer)');
      } else {
        // Se não há usuário, redireciona para a tela de login
        console.log('Nenhum usuário logado, redirecionando para /splash');
        router.replace('/splash');
      }
    }
  }, [user, loading, router]); // Dependências do useEffect

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <Stack>

      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro" options={{ headerShown: false }} />
      <Stack.Screen name="replacePass" options={{ headerShown: false }} />
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />


      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />

      <Stack.Screen
        name="notifications"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});