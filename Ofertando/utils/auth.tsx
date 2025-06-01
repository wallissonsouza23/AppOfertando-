// utils/auth.ts
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Sua URL base da API. Certifique-se de que este IP é acessível pelo seu emulador/dispositivo.
const API_BASE = 'http://192.168.1.7:3000'; // VERIFIQUE E AJUSTE ESTE IP SE NECESSÁRIO!

interface UserInfo {
  id: string;
  email: string;
  nome?: string;
  avatarUrl?: string; // Aqui DEVE ser o caminho RELATIVO (ex: /uploads/avatars/...)
  telefone?: string;
  dataNascimento?: string;
}

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (nome: string, dataNascimento: string, telefone: string, email: string, senha: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
  updateUser: (newUserData: Partial<UserInfo>) => void; // Função para atualizar o usuário no contexto
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Função auxiliar para extrair o caminho relativo se for um URL absoluto
  const getRelativeAvatarUrl = (url: string | undefined | null): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith(API_BASE)) {
      return url.substring(API_BASE.length);
    }
    // Se já for relativo ou não começar com http (mas não com API_BASE), retorna como está
    return url;
  };

  const fetchUserDataWithToken = async (token: string): Promise<UserInfo | null> => {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.warn('Token JWT inválido (estrutura).');
        return null;
      }
      const payload = JSON.parse(atob(tokenParts[1]));

      // Verifique se o payload contém as propriedades esperadas
      if (!payload.sub || !payload.email) {
          console.warn('Payload JWT incompleto: missing sub or email.');
          return null;
      }
      
      // CORREÇÃO AQUI: Armazenar avatarUrl como RELATIVO no estado do contexto
      const relativeAvatarUrl = getRelativeAvatarUrl(payload.avatarUrl);
      
      // Construa o userInfo a partir do payload do JWT
      return {
        id: payload.sub,
        email: payload.email,
        nome: payload.nome,
        avatarUrl: relativeAvatarUrl, // Usar a URL RELATIVA aqui
        telefone: payload.telefone,
        dataNascimento: payload.dataNascimento
      } as UserInfo;

    } catch (error) {
      console.error("Erro ao decodificar token ou buscar dados do usuário:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          const userInfo = await fetchUserDataWithToken(storedToken);
          if (userInfo) {
            setUser(userInfo);
          } else {
            await AsyncStorage.removeItem('userToken'); 
            setUser(null);
          }
        }
      } catch (e) {
        console.error("Erro ao carregar usuário do storage:", e);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();

    // Configuração do interceptor de requisição para adicionar o token
    const requestInterceptor = axios.interceptors.request.use(
      async config => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Axios Interceptor: Token adicionado ao header.');
        } else {
          console.log('Axios Interceptor: Nenhum token encontrado no AsyncStorage.');
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Configuração do interceptor de resposta para lidar com 401 Unauthorized
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          console.warn('Token expirado ou inválido. Redirecionando para login.');
          await signOut();
        }
        return Promise.reject(error);
      }
    );

    // Limpar interceptors ao desmontar o componente para evitar duplicações
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };

  }, []);

  const signIn = async (email: string, senha: string) => { 
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, { email, senha });
      console.log('Resposta do backend no login:', response.data);

      const { token, user: userData } = response.data; 
      
      await AsyncStorage.setItem('userToken', token);
      
      // CORREÇÃO AQUI: Armazenar avatarUrl como RELATIVO no estado do contexto
      const userToSet = {
        ...userData,
        avatarUrl: getRelativeAvatarUrl(userData.avatarUrl) // Garante que seja relativo
      };

      setUser(userToSet); 
      console.log('Login bem-sucedido. Usuário no AuthContext:', userToSet);
    } catch (error: any) {
      console.error("Erro no login:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Falha ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (nome: string, dataNascimento: string, telefone: string, email: string, senha: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, {
        nome,
        dataNascimento, 
        telefone,
        email,
        senha
      });
      console.log('Cadastro bem-sucedido:', response.data);
    } catch (error: any) {
      console.error("Erro no cadastro:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Falha ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/forgot-password`, { email }); 
      console.log('Solicitação de redefinição de senha enviada para:', email);
    } catch (error: any) {
      console.error("Erro na redefinição de senha:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Falha ao solicitar redefinição de senha.");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      console.log('Realizando logout...');
      await AsyncStorage.removeItem('userToken');
      setUser(null);
      console.log('Logout bem-sucedido.');
      router.replace('/login'); 
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error.message);
      throw new Error(error.message || "Falha ao fazer logout.");
    } finally {
      setLoading(false);
    }
  };

  const getToken = async () => {
    return AsyncStorage.getItem('userToken');
  };

  const updateUser = (newUserData: Partial<UserInfo>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      
      // CORREÇÃO AQUI: Garantir que o avatarUrl seja RELATIVO ANTES de armazenar no estado
      const updatedAvatarUrl = getRelativeAvatarUrl(newUserData.avatarUrl);

      return { 
        ...prevUser, 
        ...newUserData,
        ...(updatedAvatarUrl !== undefined ? { avatarUrl: updatedAvatarUrl } : {}) // Atualiza apenas se provided
      };
    });
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    forgotPassword,
    signOut,
    getToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};