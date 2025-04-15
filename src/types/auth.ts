export interface User {
    id: string;
    apelido: string;
    nome: string;
    email: string;
  }
  
  export interface AuthState {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    apelido: string;
    senha: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }