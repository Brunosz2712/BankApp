import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '../types/transaction';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionItemProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  
  const formattedDate = format(new Date(transaction.data), "dd 'de' MMMM, yyyy", { locale: ptBR });
  
  
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(transaction.valor);

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(transaction)}
    >
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.descricao || (transaction.tipo === 'credito' ? 'Recebido' : 'Enviado')}
          </Text>
        </View>
        
        <Text style={[
          styles.value, 
          transaction.tipo === 'credito' ? styles.creditValue : styles.debitValue
        ]}>
          {transaction.tipo === 'credito' ? '+' : '-'} {formattedValue}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  creditValue: {
    color: '#4CAF50',
  },
  debitValue: {
    color: '#F44336',
  },
});

export default TransactionItem;