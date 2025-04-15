import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FormInput from '../../components/FormInput';
import { authService } from '../../services/auth';

interface RegisterFormData {
  nome: string;
  documento: string;
  apelido: string;
  senha: string;
}

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    nome: '',
    documento: '',
    apelido: '',
    senha: ''
  });
  const [errors, setErrors] = useState({
    nome: '',
    documento: '',
    apelido: '',
    senha: ''
  });

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { nome: '', documento: '', apelido: '', senha: '' };

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
      isValid = false;
    }

    if (!formData.documento.trim()) {
      newErrors.documento = 'Documento é obrigatório';
      isValid = false;
    } else if (!/^\d{11}$/.test(formData.documento)) {
      newErrors.documento = 'Documento deve conter 11 dígitos';
      isValid = false;
    }

    if (!formData.apelido.trim()) {
      newErrors.apelido = 'Apelido é obrigatório';
      isValid = false;
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
      isValid = false;
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      // Chama o serviço de registro
      await authService.register(formData);
      
      Alert.alert(
        'Sucesso',
        'Conta criada com sucesso! Você já pode fazer login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login' as never) }]
      );
    } catch (error: any) {
      Alert.alert(
        'Erro ao criar conta',
        error.message || 'Não foi possível criar sua conta. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Criar Conta</Text>
          <Text style={styles.subtitleText}>Preencha os dados para se cadastrar</Text>
        </View>

        <View style={styles.formContainer}>
          <FormInput
            label="Nome Completo"
            placeholder="Digite seu nome completo"
            value={formData.nome}
            onChangeText={(text) => setFormData({ ...formData, nome: text })}
            error={errors.nome}
          />

          <FormInput
            label="Documento (CPF)"
            placeholder="Digite seu CPF (apenas números)"
            keyboardType="numeric"
            value={formData.documento}
            onChangeText={(text) => setFormData({ ...formData, documento: text })}
            error={errors.documento}
            maxLength={11}
          />

          <FormInput
            label="Apelido"
            placeholder="Escolha um apelido para login"
            autoCapitalize="none"
            value={formData.apelido}
            onChangeText={(text) => setFormData({ ...formData, apelido: text })}
            error={errors.apelido}
          />

          <FormInput
            label="Senha"
            placeholder="Crie uma senha"
            secureTextEntry
            value={formData.senha}
            onChangeText={(text) => setFormData({ ...formData, senha: text })}
            error={errors.senha}
          />

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.registerButtonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login' as never)}
          >
            <Text style={styles.loginLinkText}>
              Já tem uma conta? Faça login
            </Text>
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
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerContainer: {
    marginTop: 60,
    marginBottom: 32,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    width: '100%',
  },
  registerButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 24,
    padding: 12,
  },
  loginLinkText: {
    color: '#2196F3',
    fontSize: 16,
  },
});

export default RegisterScreen;