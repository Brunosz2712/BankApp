import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Share,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const ReceiveMoneyScreen: React.FC = () => {
  const { authState } = useAuth();

  const handleShare = async () => {
    try {
      if (authState.user) {
        await Share.share({
          message: `Envie dinheiro para mim usando o BankApp! Meu apelido é: ${authState.user.apelido}`,
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  return (
    <ScrollView style={styles.container}></ScrollView>