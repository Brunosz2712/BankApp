import React, { useState, useEffect, useCallback } from 'react';
import {
 View,
 Text,
 StyleSheet,
 FlatList,
 RefreshControl,
 TouchableOpacity,
 ActivityIndicator,
 Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { transactionService } from '../../services/transaction';
import { Transaction } from '../../types/transaction';
import TransactionItem from '../../components/TransactionItem';
import { RootStackParamList } from '../../types/navigation'; // Importando o tipo de navegação
// Definindo o tipo para a navegação deste componente
type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
const DashboardScreen: React.FC = () => {
 const navigation = useNavigation<DashboardScreenNavigationProp>(); // Navegação com tipo correto
 const { authState } = useAuth();
 const [transactions, setTransactions] = useState<Transaction[]>([]);
 const [saldo, setSaldo] = useState<number>(0);
 const [isLoading, setIsLoading] = useState<boolean>(true);
 const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
 const [page, setPage] = useState<number>(1);
 const [hasMoreData, setHasMoreData] = useState<boolean>(true);
 const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
 const fetchTransactions = useCallback(async (pageNumber = 1, shouldRefresh = false) => {
   if (!authState.token) return;
   try {
     if (pageNumber === 1) {
       shouldRefresh ? setIsRefreshing(true) : setIsLoading(true);
     } else {
       setIsLoadingMore(true);
     }
     const response = await transactionService.getTransactions(authState.token, pageNumber);
     if (pageNumber === 1) {
       setTransactions(response.transactions);
     } else {
       setTransactions((prev) => [...prev, ...response.transactions]);
     }
     setSaldo(response.saldo);
     setHasMoreData(response.hasMore);
     setPage(pageNumber);
   } catch (error) {
     Alert.alert('Erro', 'Não foi possível carregar as transações');
     console.error(error);
   } finally {
     setIsLoading(false);
     setIsRefreshing(false);
     setIsLoadingMore(false);
   }
 }, [authState.token]);
 useEffect(() => {
   fetchTransactions();
 }, [fetchTransactions]);
 const handleRefresh = () => {
   fetchTransactions(1, true);
 };
 const handleLoadMore = () => {
   if (hasMoreData && !isLoadingMore) {
     fetchTransactions(page + 1);
   }
 };
 // Função corrigida sem o "as never"
 const handleTransactionPress = (transaction: Transaction) => {
   navigation.navigate('TransactionDetails', { transactionId:
transaction.id
});
 };
 // Função corrigida sem o "as never"
 const handleSendMoney = () => {
   navigation.navigate('SendMoney');
 };
 // Formata o saldo como moeda brasileira
 const formattedBalance = new Intl.NumberFormat('pt-BR', {
   style: 'currency',
   currency: 'BRL'
 }).format(saldo);
 if (isLoading) {
   return (
<View style={styles.loadingContainer}>
<ActivityIndicator size="large" color="#2196F3" />
</View>
   );
 }
 return (
<View style={styles.container}>
<View style={styles.header}>
<View>
<Text style={styles.welcomeText}>Olá, {authState.user?.nome?.split(' ')[0]}</Text>
<Text style={styles.balanceLabel}>Seu saldo atual</Text>
<Text style={styles.balanceValue}>{formattedBalance}</Text>
</View>
       {/* Função de navegação corrigida sem o "as never" */}
<TouchableOpacity
         style={styles.receiveButton}
         onPress={() => navigation.navigate('ReceiveMoney')}>
<Ionicons name="arrow-down" size={20} color="#fff" />
<Text style={styles.receiveButtonText}>Receber</Text>
</TouchableOpacity>
</View>
<View style={styles.transactionsContainer}>
<View style={styles.transactionsHeader}>
<Text style={styles.transactionsTitle}>Extrato</Text>
<TouchableOpacity onPress={handleSendMoney} style={styles.sendButton}>
<Ionicons name="arrow-up" size={20} color="#fff" />
<Text style={styles.sendButtonText}>Enviar</Text>
</TouchableOpacity>
</View>
<FlatList
         data={transactions}
         keyExtractor={(item) => item.id}
         renderItem={({ item }) => (
<TransactionItem
             transaction={item}
             onPress={handleTransactionPress}
           />
         )}
         refreshControl={
<RefreshControl
             refreshing={isRefreshing}
             onRefresh={handleRefresh}
             colors={['#2196F3']}
           />
         }
         onEndReached={handleLoadMore}
         onEndReachedThreshold={0.1}
         ListEmptyComponent={
<View style={styles.emptyContainer}>
<Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
</View>
         }
         ListFooterComponent={
           isLoadingMore ? (
<View style={styles.loadMoreContainer}>
<ActivityIndicator size="small" color="#2196F3" />
</View>
           ) : null
         }
       />
</View>
</View>
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
 header: {
   backgroundColor: '#2196F3',
   paddingTop: 60,
   paddingBottom: 20,
   paddingHorizontal: 20,
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
 },
 welcomeText: {
   fontSize: 16,
   color: '#ffffff',
   marginBottom: 8,
 },
 balanceLabel: {
   fontSize: 14,
   color: '#ffffff',
   opacity: 0.8,
   marginBottom: 4,
 },
 balanceValue: {
   fontSize: 24,
   fontWeight: 'bold',
   color: '#ffffff',
 },
 receiveButton: {
   backgroundColor: 'rgba(255, 255, 255, 0.2)',
   borderRadius: 8,
   paddingVertical: 8,
   paddingHorizontal: 16,
   flexDirection: 'row',
   alignItems: 'center',
 },
 receiveButtonText: {
   color: '#fff',
   marginLeft: 6,
   fontWeight: '500',
 },
 transactionsContainer: {
   flex: 1,
   backgroundColor: '#ffffff',
   borderTopLeftRadius: 20,
   borderTopRightRadius: 20,
   marginTop: -20,
   paddingTop: 20,
 },
 transactionsHeader: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   paddingHorizontal: 20,
   marginBottom: 10,
 },
 transactionsTitle: {
   fontSize: 18,
   fontWeight: 'bold',
   color: '#333',
 },
 sendButton: {
   backgroundColor: '#2196F3',
   borderRadius: 8,
   paddingVertical: 8,
   paddingHorizontal: 16,
   flexDirection: 'row',
   alignItems: 'center',
 },
 sendButtonText: {
   color: '#fff',
   marginLeft: 6,
   fontWeight: '500',
 },
 emptyContainer: {
   padding: 20,
   alignItems: 'center',
 },
 emptyText: {
   fontSize: 16,
   color: '#888',
 },
 loadMoreContainer: {
   paddingVertical: 20,
 },
});
export default DashboardScreen;