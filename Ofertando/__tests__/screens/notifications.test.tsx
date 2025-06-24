import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NotificationsScreen from '../../app/notifications';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

describe('NotificationsScreen', () => {
  beforeEach(() => {
    mockGoBack.mockClear();
  });

  it('renderiza o título e a lista de notificações', () => {
    const { getByText, getAllByText } = render(<NotificationsScreen />);

    expect(getByText('Notificações')).toBeTruthy();
    expect(getByText('Claudia Alves')).toBeTruthy();
    expect(getByText('Entrega grátis')).toBeTruthy();
    expect(getByText('Você ganhou um cupom de 10%')).toBeTruthy();

    const comentarios = getAllByText('Comentou em seu produto.');
    expect(comentarios.length).toBe(2); // Verifica que existem dois iguais
  });

  it('chama navigation.goBack ao pressionar o botão de voltar', () => {
    const { getByTestId } = render(<NotificationsScreen />);
    const backButton = getByTestId('btn-back');

    fireEvent.press(backButton);

    expect(mockGoBack).toHaveBeenCalled();
  });
});
