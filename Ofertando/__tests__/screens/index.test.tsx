import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WelcomeScreen from '../../app/index';
import { useRouter } from 'expo-router';

// 🔁 Mock do hook useRouter
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('WelcomeScreen', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it('renderiza logo, título e botões', () => {
    const { getByText, getByRole } = render(<WelcomeScreen />);

    expect(getByText('Ofertando')).toBeTruthy();
    expect(getByText('Acessar')).toBeTruthy();
    expect(getByText('Criar Conta')).toBeTruthy();
  });

  it('navega para login ao pressionar "Acessar"', () => {
    const { getByText } = render(<WelcomeScreen />);
    fireEvent.press(getByText('Acessar'));

    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('navega para cadastro ao pressionar "Criar Conta"', () => {
    const { getByText } = render(<WelcomeScreen />);
    fireEvent.press(getByText('Criar Conta'));

    expect(pushMock).toHaveBeenCalledWith('/cadastro');
  });
});
