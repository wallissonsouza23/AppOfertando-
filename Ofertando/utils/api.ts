// utils/api.ts
export const API_BASE = 'http://192.168.1.7:3000';

import axios from 'axios';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});
