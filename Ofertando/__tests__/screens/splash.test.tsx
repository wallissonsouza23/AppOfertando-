import React from 'react';
import { render } from '@testing-library/react-native';
import SplashScreen from '../../app/splash';
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('SplashScreen', () => {
  const replaceMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      replace: replaceMock,
    });

    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renderiza imagem e texto corretamente', () => {
    const { getByText, getByTestId } = render(<SplashScreen />);

    expect(getByText('Ofertando')).toBeTruthy();
    expect(getByTestId('logo-image')).toBeTruthy();
  });

  it('chama router.replace após 2 segundos', () => {
    render(<SplashScreen />);
    expect(replaceMock).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);
    expect(replaceMock).toHaveBeenCalledWith('/');
  });
});
