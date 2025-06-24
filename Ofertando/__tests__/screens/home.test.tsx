import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Home from '../../app/(drawer)/(tabs)/home';

// Cria o mock aqui dentro, dentro da factory do jest.mock
jest.mock('expo-router', () => {
  return {
    useRouter: () => ({
      push: jest.fn(), // jest.fn() direto aqui, sem variável externa
    }),
  };
});

describe('Home Screen', () => {
  it('renderiza textos importantes e permite navegação via banner', () => {
    // Reimporta o módulo para pegar o mock atualizado
    const { useRouter } = require('expo-router');
    const router = useRouter();

    const { getByText } = render(<Home />);

    expect(getByText('COMEÇAR')).toBeTruthy();
    expect(getByText('Frutas')).toBeTruthy();
    expect(getByText('Carnes')).toBeTruthy();
    expect(getByText('Bebidas')).toBeTruthy();
    expect(getByText('Laticínios')).toBeTruthy();

    fireEvent.press(getByText('COMEÇAR'));

    expect(router.push).toHaveBeenCalledWith('/modal');
  });
});
