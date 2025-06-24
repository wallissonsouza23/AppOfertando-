// __tests__/screens/CustomDrawer.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../../app/CustomDrawer';
import { useAuth } from '../../utils/auth';

jest.mock('expo-router', () => {
  // Define mocks dentro da factory para evitar erro
  return {
    useRouter: () => ({
      navigate: jest.fn(),
      replace: jest.fn(),
    }),
  };
});

jest.mock('../../utils/auth', () => ({
  useAuth: jest.fn(),
}));

const Drawer = createDrawerNavigator();

const mockUser = {
  nome: 'Ygor Cortês',
  email: 'ygor@example.com',
  avatarUrl: '/avatars/ygor.png',
};

function DummyScreen() {
  return null;
}

describe('CustomDrawer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderWithDrawer() {
    // Para acessar mocks de dentro do useRouter precisamos pegar eles do módulo
    const router = require('expo-router');
    const routerMock = router.useRouter();

    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      signOut: jest.fn().mockResolvedValue(undefined),
    });

    return {
      ...render(
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{ headerShown: false }}
          >
            <Drawer.Screen name="home" component={DummyScreen} />
            <Drawer.Screen name="ofertas" component={DummyScreen} />
            <Drawer.Screen name="favoritos" component={DummyScreen} />
            <Drawer.Screen name="perfil" component={DummyScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      ),
      routerMock,
    };
  }

  it('renderiza corretamente com o usuário', () => {
    const { getByText } = renderWithDrawer();

    expect(getByText('Ygor Cortês')).toBeTruthy();
    expect(getByText('ygor@example.com')).toBeTruthy();
    expect(getByText('Início')).toBeTruthy();
    expect(getByText('Ofertas')).toBeTruthy();
    expect(getByText('Favoritos')).toBeTruthy();
    expect(getByText('Perfil')).toBeTruthy();
    expect(getByText('Sair')).toBeTruthy();
  });

  it('navega para /home ao tocar em "Início"', () => {
    const { getByText, routerMock } = renderWithDrawer();

    fireEvent.press(getByText('Início'));
    expect(routerMock.navigate).toHaveBeenCalledWith('/(drawer)/(tabs)/home');
  });

  it('chama signOut e navega para /login ao tocar em "Sair"', async () => {
    const signOutMock = jest.fn().mockResolvedValue(undefined);
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      signOut: signOutMock,
    });

    const { getByText, routerMock } = renderWithDrawer();

    fireEvent.press(getByText('Sair'));

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalled();
      expect(routerMock.replace).toHaveBeenCalledWith('/login');
    });
  });

  it('exibe "Carregando perfil..." quando user é null', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      signOut: jest.fn(),
    });

    const { getByText } = render(
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawer {...props} />}
          screenOptions={{ headerShown: false }}
        >
          <Drawer.Screen name="home" component={DummyScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    expect(getByText('Carregando perfil...')).toBeTruthy();
  });
});
