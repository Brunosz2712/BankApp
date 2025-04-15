import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { LoginCredentials, User } from '../types/auth';
import { authService } from '../services/auth';


const TOKEN_KEY = 'bank_app_token';
const USER_KEY = 'bank_app_user';

export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextData {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
    isLoading: true,
    error: null,
  });

  
  useEffect(() => {
    const loadStoredAuthData = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);

        if (storedToken && storedUser) {
          setAuthState({
            token: storedToken,
            user: JSON.parse(storedUser),
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error);
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: 'Erro ao carregar dados de autenticação'
        }));
      }
    };

    loadStoredAuthData();
  }, []);

  const storeAuthData = async (token: string, user: User) => {
    try {
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, token),
        SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
      ]);
    } catch (error) {
      console.error('Erro ao armazenar dados de autenticação:', error);
    }
  };

  const clearAuthData = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
      ]);
    } catch (error) {
      console.error('Erro ao limpar dados de autenticação:', error);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authService.login(credentials);
      
      
      await storeAuthData(response.token, response.user);
      
      
      setAuthState({
        token: response.token,
        user: response.user,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Credenciais inválidas. Tente novamente.' 
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      if (authState.token) {
        await authService.logout(authState.token);
      }
      
      
      await clearAuthData();
      
      
      setAuthState({
        token: null,
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error.message || 'Erro ao fazer logout'
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);