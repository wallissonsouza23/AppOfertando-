import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ReplacePass from '../../app/replacePass';
import { useAuth } from '../../utils/auth';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

// Mock do contexto de autenticação
jest.mock('../../utils/auth', () => ({
  useAuth: jest.fn(),
}));

// Mock do roteador do expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock do Alert
jest.spyOn(Alert, 'alert');

describe('ReplacePass screen', () => {
  const forgotPasswordMock = jest.fn();
  const backMock = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      forgotPassword: forgotPasswordMock,
    });

    (useRouter as jest.Mock).mockReturnValue({
      back: backMock,
    });

    forgotPasswordMock.mockReset();
    backMock.mockReset();
    jest.clearAllMocks();
  });

  it('renderiza todos os elementos corretamente', () => {
    const { getByText, getByPlaceholderText } = render(<ReplacePass />);

    expect(getByText('Redefinir Senha')).toBeTruthy();
    expect(getByText('Digite seu email para redefinir a senha')).toBeTruthy();
    expect(getByPlaceholderText('Digite seu email')).toBeTruthy();
    expect(getByText('Enviar')).toBeTruthy();
  });

  it('exibe erro se o email estiver vazio', () => {
    const { getByText } = render(<ReplacePass />);
    fireEvent.press(getByText('Enviar'));

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, insira seu email.');
    expect(forgotPasswordMock).not.toHaveBeenCalled();
  });

  it('chama forgotPassword e exibe sucesso com email válido', async () => {
    const { getByPlaceholderText, getByText } = render(<ReplacePass />);
    const input = getByPlaceholderText('Digite seu email');

    fireEvent.changeText(input, 'teste@email.com');
    fireEvent.press(getByText('Enviar'));

    await waitFor(() => {
      expect(forgotPasswordMock).toHaveBeenCalledWith('teste@email.com');
      expect(Alert.alert).toHaveBeenCalledWith('Sucesso', 'Verifique seu email para redefinir sua senha.');
      expect(backMock).toHaveBeenCalled();
    });
  });

  it('exibe erro se forgotPassword lançar exceção', async () => {
    forgotPasswordMock.mockRejectedValueOnce(new Error('Erro de rede'));

    const { getByPlaceholderText, getByText } = render(<ReplacePass />);
    const input = getByPlaceholderText('Digite seu email');

    fireEvent.changeText(input, 'teste@email.com');
    fireEvent.press(getByText('Enviar'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Erro de rede');
    });
  });
});
