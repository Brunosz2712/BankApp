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
import { useAuth } from '../../contexts/AuthContext';
import { LoginCredentials } from '../../types/auth';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { login, authState } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    apelido: '',
    senha: '',
  });
  const [errors, setErrors] = useState({
    apelido: '',
    senha: '',
  });

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { apelido: '', senha: '' };

    if (!credentials.apelido.trim()) {
      newErrors.apelido = 'Apelido é obrigatório';
      isValid = false;
    }

    if (!credentials.senha) {
      newErrors.senha = 'Senha é obrigatória';
      isValid = false;
    } else if (credentials.senha.length < 6) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(credentials);
      // A navegação será realizada no App.tsx com base no estado de autenticação
    } catch (error: any) {
      Alert.alert(
        'Erro de autenticação',
        error.message || 'Não foi possível fazer login. Verifique suas credenciais.'
      );
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
        <View style={styles.logoContainer}>
          {/* Aqui você pode adicionar o logo do banco */}
          <Text style={styles.logoText}>Bank App</Text>
        </View>

        <Text style={styles.welcomeText}>Bem-vindo ao seu banco digital</Text>
        <Text style={styles.subtitleText}>Faça login para continuar</Text>

        <View style={styles.formContainer}>
          <FormInput
            label="Apelido"
            placeholder="Digite seu apelido"
            autoCapitalize="none"
            value={credentials.apelido}
            onChangeText={(text) => setCredentials({ ...credentials, apelido: text })}
            error={errors.apelido}
            keyboardType="default"
          />

          <FormInput
            label="Senha"
            placeholder="Digite sua senha"
            secureTextEntry
            value={credentials.senha}
            onChangeText={(text) => setCredentials({ ...credentials, senha: text })}
            error={errors.senha}
          />

          {authState.error && (
            <Text style={styles.errorMessage}>{authState.error}</Text>
          )}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={authState.isLoading}
          >
            {authState.isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register' as never)}
          >
            <Text style={styles.registerLinkText}>
              Não tem uma conta? Cadastre-se
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
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
  },
  errorMessage: {
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 24,
    padding: 12,
  },
  registerLinkText: {
    color: '#2196F3',
    fontSize: 16,
  },
});

export default LoginScreen;