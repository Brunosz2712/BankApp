import { api } from './api';
import { Transaction, TransactionListResponse } from '../types/transaction';

interface SendMoneyData {
  destinatarioEmail: string;
  valor: number;
  descricao?: string;
}

export const transactionService = {
  async getTransactions(token: string, page: number = 1, limit: number = 10): Promise<TransactionListResponse> {
    return api.fetch<TransactionListResponse>(`/transactions?page=${page}&limit=${limit}`, {
      method: 'GET',
      ...api.setAuthToken(token),
    });
  },

  async getTransactionDetails(token: string, transactionId: string): Promise<Transaction> {
    return api.fetch<Transaction>(`/transactions/${transactionId}`, {
      method: 'GET',
      ...api.setAuthToken(token),
    });
  },

  async sendMoney(token: string, data: SendMoneyData): Promise<Transaction> {
    return api.fetch<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
      ...api.setAuthToken(token),
    });
  },

  // Método para buscar informações de conta do usuário (saldo, etc)
  async getAccountInfo(token: string): Promise<{ saldo: number }> {
    return api.fetch<{ saldo: number }>('/account', {
      method: 'GET',
      ...api.setAuthToken(token),
    });
  }
};