import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import CadastroScreen from '../../app/cadastro';
import { Alert } from 'react-native';

const mockSignUp = jest.fn();

jest.mock('../../utils/auth', () => ({
    useAuth: () => ({
        signUp: mockSignUp,
        loading: false,
    }),
}));

// Mock para suprimir warnings do Icon dentro de act
jest.mock('@expo/vector-icons/MaterialIcons', () => 'Icon');
jest.mock('@expo/vector-icons/Feather', () => 'Icon');

const originalConsoleError = console.error;

// Suprime os warnings de "act" para não poluir o output
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
        if (
            typeof msg === 'string' &&
            msg.includes('An update to Icon inside a test was not wrapped in act')
        ) {
            return;
        }
        originalConsoleError(msg, ...args);
    });
});

describe('CadastroScreen', () => {
    let alertMock: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => { });
    });

    it('renderiza todos os campos obrigatórios', () => {
        const { getByPlaceholderText, getByText } = render(<CadastroScreen />);
        expect(getByPlaceholderText('Digite seu nome')).toBeTruthy();
        expect(getByPlaceholderText('dd/mm/yyyy')).toBeTruthy();
        expect(getByPlaceholderText('(00)00000-0000')).toBeTruthy();
        expect(getByPlaceholderText('Digite seu email')).toBeTruthy();
        expect(getByPlaceholderText('Digite sua senha')).toBeTruthy();
        expect(getByPlaceholderText('Confirme sua senha')).toBeTruthy();
        expect(getByText('Cadastrar')).toBeTruthy();
    });

    it('impede cadastro com campos inválidos e exibe alerta', async () => {
        const { getByPlaceholderText, getByText } = render(<CadastroScreen />);

        // Preenche com dados inválidos que quebram a validação atual (formato errado na data)
        await act(async () => {
            fireEvent.changeText(getByPlaceholderText('Digite seu nome'), 'Ygor Cortês');
            fireEvent.changeText(getByPlaceholderText('dd/mm/yyyy'), '99/99/9999'); // data formato inválido
            fireEvent.changeText(getByPlaceholderText('(00)00000-0000'), '(99)99999-9999');
            fireEvent.changeText(getByPlaceholderText('Digite seu email'), 'ygor@example.com');
            fireEvent.changeText(getByPlaceholderText('Digite sua senha'), 'abc123');
            fireEvent.changeText(getByPlaceholderText('Confirme sua senha'), 'abc123');
        });

        // O botão fica desabilitado, mas vamos tentar clicar para disparar o alerta
        const button = getByText('Cadastrar').parent;

        await act(async () => {
            fireEvent.press(getByText('Cadastrar'));
        });


        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith(
                'Erro',
                expect.stringContaining('preencha')
            );
            expect(mockSignUp).not.toHaveBeenCalled();
        });
    });


    it('realiza cadastro com dados válidos', async () => {
        mockSignUp.mockResolvedValueOnce(undefined);

        const { getByPlaceholderText, getByText } = render(<CadastroScreen />);

        await act(async () => {
            fireEvent.changeText(getByPlaceholderText('Digite seu nome'), 'Ygor Cortês');
            fireEvent.changeText(getByPlaceholderText('dd/mm/yyyy'), '01/01/1990');
            fireEvent.changeText(getByPlaceholderText('(00)00000-0000'), '(99)99999-9999');
            fireEvent.changeText(getByPlaceholderText('Digite seu email'), 'ygor@example.com');
            fireEvent.changeText(getByPlaceholderText('Digite sua senha'), 'abc123'); // senha com letras e números
            fireEvent.changeText(getByPlaceholderText('Confirme sua senha'), 'abc123');
        });

        const button = getByText('Cadastrar');

        // Verifica se o botão está habilitado
        expect(button.props.accessibilityState?.disabled).toBeFalsy();

        await act(async () => {
            fireEvent.press(button);
        });

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalledWith(
                'Ygor Cortês',
                '1990-01-01', // Data em formato ISO esperado
                '(99)99999-9999',
                'ygor@example.com',
                'abc123'
            );
        });
    });
});
