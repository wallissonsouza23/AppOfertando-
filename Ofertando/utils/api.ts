import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE = 'http://192.168.1.2:3000';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// ✅ Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token adicionado ao header da instância API');
    } else {
      console.warn('Nenhum token encontrado para a instância API');
    }
    return config;
  },
  error => Promise.reject(error)
);

// (opcional) Interceptor de resposta para logout automático em 401
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      console.warn('Erro 401 na instância API. Token pode estar expirado.');
      // Aqui você pode usar um EventEmitter ou set alguma flag para disparar logout se quiser.
    }
    return Promise.reject(error);
  }
);
