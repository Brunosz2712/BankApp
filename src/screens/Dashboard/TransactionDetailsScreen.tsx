import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { transactionService } from '../../services/transaction';
import { Transaction } from '../../types/transaction';

type TransactionDetailsRouteProp = RouteProp<
  { TransactionDetails: { transactionId: string } },
  'TransactionDetails'
>;

const TransactionDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<TransactionDetailsRouteProp>();
  const { transactionId } = route.params;
  const { authState } = useAuth();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!authState.token) return;

      try {
        setIsLoading(true);
        const transactionData = await transactionService.getTransactionDetails(
          authState.token,
          transactionId
        );
        setTransaction(transactionData);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os detalhes da transação');
        console.error(error);
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [authState.token, transactionId, navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Dados da transação não encontrados</Text>
      </View>
    );
  }

  // Formata a data no estilo brasileiro
  const formattedDate = format(new Date(transaction.data), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  
  // Formata o valor como moeda brasileira
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(transaction.valor);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.valueContainer}>
          <View style={[
            styles.iconContainer,
            transaction.tipo === 'credito' ? styles.creditIconContainer : styles.debitIconContainer
          ]}>
            <Ionicons
              name={transaction.tipo === 'credito' ? 'arrow-down' : 'arrow-up'}
              size={24}
              color="#fff"
            />
          </View>
          <Text style={[
            styles.valueText,
            transaction.tipo === 'credito' ? styles.creditText : styles.debitText
          ]}>
            {transaction.tipo === 'credito' ? '+' : '-'} {formattedValue}
          </Text>
          <Text style={styles.typeText}>
            {transaction.tipo === 'credito' ? 'Recebido' : 'Enviado'}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Data</Text>
            <Text style={styles.detailValue}>{formattedDate}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Descrição</Text>
            <Text style={styles.detailValue}>{transaction.descricao || 'Sem descrição'}</Text>
          </View>

          <View style={styles.divider} />

          {transaction.tipo === 'credito' && transaction.remetente && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Remetente</Text>
                <Text style={styles.detailValue}>{transaction.remetente}</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {transaction.tipo === 'debito' && transaction.destinatario && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Destinatário</Text>
                <Text style={styles.detailValue}>{transaction.destinatario}</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {transaction.categoria && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Categoria</Text>
                <Text style={styles.detailValue}>{transaction.categoria}</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>ID da Transação</Text>
            <Text style={styles.detailValue}>{transaction.id}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
  },
  card: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  valueContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  creditIconContainer: {
    backgroundColor: '#4CAF50',
  },
  debitIconContainer: {
    backgroundColor: '#F44336',
  },
  valueText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  creditText: {
    color: '#4CAF50',
  },
  debitText: {
    color: '#F44336',
  },
  typeText: {
    fontSize: 16,
    color: '#666',
  },
  detailsContainer: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  detailLabel: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    flex: 2,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
});

export default TransactionDetailsScreen;