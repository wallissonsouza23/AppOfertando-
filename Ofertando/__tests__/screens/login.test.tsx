import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import LoginScreen from '../../app/login';
import { useAuth } from '../../utils/auth';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

jest.mock('../../utils/auth', () => ({
  useAuth: jest.fn(),
}));

describe('LoginScreen', () => {
  const mockSignIn = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      loading: false,
    });
    jest.clearAllMocks();
  });

  it('renderiza os campos de email e senha corretamente', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByPlaceholderText('Digite seu email')).toBeTruthy();
    expect(getByPlaceholderText('Digite sua senha')).toBeTruthy();
    expect(getByText('Acessar')).toBeTruthy();
  });

  it('exibe alerta se campos estiverem vazios', async () => {
    // mock do Alert.alert (usado no seu código)
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByText } = render(<LoginScreen />);

    await act(async () => {
      fireEvent.press(getByText('Acessar'));
    });

    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled();
      expect(alertMock).toHaveBeenCalledWith('Erro', 'Por favor, preencha seu e-mail e senha.');
    });

    alertMock.mockRestore();
  });

  it('chama signIn com email e senha válidos', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('Digite seu email'), 'teste@email.com');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), 'senha123');

    await act(async () => {
      fireEvent.press(getByText('Acessar'));
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('teste@email.com', 'senha123');
    });
  });
});
