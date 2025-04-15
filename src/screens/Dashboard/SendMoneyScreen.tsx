import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { transactionService } from '../../services/transaction';
import FormInput from '../../components/FormInput';

interface SendMoneyForm {
  destinatarioEmail: string;
  valor: string;
  descricao: string;
}

const SendMoneyScreen: React.FC = () => {
  const navigation = useNavigation();
  const { authState } = useAuth();
  const [formData, setFormData] = useState<SendMoneyForm>({
    destinatarioEmail: '',
    valor: '',
    descricao: '',
  });
  const [errors, setErrors] = useState({
    destinatarioEmail: '',
    valor: '',
    descricao: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saldo, setSaldo] = useState<number>(0);
  const [isLoadingSaldo, setIsLoadingSaldo] = useState<boolean>(true);

  useEffect(() => {
    const fetchSaldo = async () => {
      if (!authState.token) return;

      try {
        setIsLoadingSaldo(true);
        const accountInfo = await transactionService.getAccountInfo(authState.token);
        setSaldo(accountInfo.saldo);
      } catch (error) {
        console.error('Erro ao buscar saldo:', error);
        Alert.alert('Erro', 'Não foi possível carregar seu saldo');
      } finally {
        setIsLoadingSaldo(false);
      }
    };

    fetchSaldo();
  }, [authState.token]);

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { destinatarioEmail: '', valor: '', descricao: '' };

    if (!formData.destinatarioEmail.trim()) {
      newErrors.destinatarioEmail = 'Email do destinatário é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.destinatarioEmail)) {
      newErrors.destinatarioEmail = 'Email inválido';
      isValid = false;
    }

    if (!formData.valor.trim()) {
      newErrors.valor = 'Valor é obrigatório';
      isValid = false;
    } else {
      const valorNumerico = parseFloat(formData.valor.replace(',', '.'));
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        newErrors.valor = 'Valor deve ser maior que zero';
        isValid = false;
      } else if (valorNumerico > saldo) {
        newErrors.valor = 'Saldo insuficiente';
        isValid = false;
      }
    }

    // Descrição é opcional, então não precisa validar

    setErrors(newErrors);
    return isValid;
  };

  const handleSendMoney = async () => {
    if (!validateForm() || !authState.token) return;

    try {
      setIsLoading(true);

      const valorNumerico = parseFloat(formData.valor.replace(',', '.'));
      
      await transactionService.sendMoney(authState.token, {
        destinatarioEmail: formData.destinatarioEmail,
        valor: valorNumerico,
        descricao: formData.descricao.trim() || undefined,
      });

      Alert.alert(
        'Sucesso',
        'Dinheiro enviado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.navigate('Dashboard' as never) }]
      );
    } catch (error: any) {
      Alert.alert(
        'Erro ao enviar dinheiro',
        error.message || 'Não foi possível concluir a transação'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Formata o saldo como moeda brasileira
  const formattedBalance = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(saldo);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Saldo disponível</Text>
          {isLoadingSaldo ? (
            <ActivityIndicator size="small" color="#2196F3" />
          ) : (
            <Text style={styles.balanceValue}>{formattedBalance}</Text>
          )}
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Enviar Dinheiro</Text>
          
          <FormInput
            label="Email do Destinatário"
            placeholder="Digite o email do destinatário"
            value={formData.destinatarioEmail}
            onChangeText={(text) => setFormData({ ...formData, destinatarioEmail: text })}
            error={errors.destinatarioEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FormInput
            label="Valor"
            placeholder="Digite o valor a enviar"
            value={formData.valor}
            onChangeText={(text) => setFormData({ ...formData, valor: text })}
            error={errors.valor}
            keyboardType="numeric"
          />

          <FormInput
            label="Descrição (opcional)"
            placeholder="Descreva o motivo da transferência"
            value={formData.descricao}
            onChangeText={(text) => setFormData({ ...formData, descricao: text })}
            error={errors.descricao}
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMoney}
            disabled={isLoading || isLoadingSaldo}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.sendButtonText}>Enviar Dinheiro</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  balanceContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SendMoneyScreen;