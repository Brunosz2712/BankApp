import { api } from './api';
import { LoginCredentials, LoginResponse } from '../types/auth';

export interface RegisterData {
  nome: string;
  documento: string;
  apelido: string;
  senha: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return api.fetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(data: RegisterData): Promise<void> {
    return api.fetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async logout(token: string): Promise<void> {
    return api.fetch('/auth/logout', {
      method: 'POST',
      ...api.setAuthToken(token),
    });
  },
};