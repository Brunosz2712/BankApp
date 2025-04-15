export interface Transaction {
    id: string;
    valor: number;
    descricao: string;
    data: string;
    tipo: 'credito' | 'debito';
    remetente?: string;
    destinatario?: string;
    categoria?: string;
  }
  
  export interface TransactionListResponse {
    transactions: Transaction[];
    saldo: number;
    hasMore: boolean;
    nextPage?: number;
  }