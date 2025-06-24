import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Modal from '../../app/modal'; // Ajuste o caminho se necessário
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('Modal Screen', () => {
  const backMock = jest.fn();

  beforeEach(() => {
    backMock.mockClear(); // 🔧 limpa o mock antes de cada teste
    (useRouter as jest.Mock).mockReturnValue({
      back: backMock,
    });
  });

  it('renderiza os campos e botões corretamente', () => {
    const { getByPlaceholderText, getByText } = render(<Modal />);

    expect(getByPlaceholderText('Seu nome')).toBeTruthy();
    expect(getByPlaceholderText('Seu e-mail')).toBeTruthy();
    expect(getByPlaceholderText('Sua mensagem')).toBeTruthy();
    expect(getByText('Cancelar')).toBeTruthy();
    expect(getByText('Enviar')).toBeTruthy();
  });

  it('chama router.back() ao pressionar "Cancelar"', () => {
    const { getByText } = render(<Modal />);
    fireEvent.press(getByText('Cancelar'));

    expect(backMock).toHaveBeenCalledTimes(1);
  });

  it('chama router.back() ao pressionar "Enviar"', () => {
    const { getByText } = render(<Modal />);
    fireEvent.press(getByText('Enviar'));

    expect(backMock).toHaveBeenCalledTimes(1);
  });
});
