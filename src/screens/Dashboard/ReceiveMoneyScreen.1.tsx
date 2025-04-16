import React from 'react';
import { ScrollView, Share, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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
<ScrollView style={styles.container}>
<View style={styles.content}>
<View style={styles.nicknameContainer}>
<Text style={styles.label}>Seu apelido para receber:</Text>
<Text style={styles.nickname}>{authState.user?.apelido}</Text>
</View>
<TouchableOpacity style={styles.shareButton} onPress={handleShare}>
<Ionicons name="share-social" size={20} color="#fff" />
<Text style={styles.shareButtonText}>Compartilhar meu apelido</Text>
</TouchableOpacity>
<View style={styles.infoContainer}>
<Text style={styles.infoTitle}>Como receber dinheiro:</Text>
<Text style={styles.infoText}>
                       1. Compartilhe seu apelido com a pessoa que vai enviar o dinheiro{'\n'}
                       2. A pessoa deve acessar a opção "Enviar" no aplicativo{'\n'}
                       3. Digitar seu apelido e o valor a ser enviado{'\n'}
                       4. Confirmar a transação{'\n'}
                       5. O valor será creditado automaticamente na sua conta
</Text>
</View>
</View>
</ScrollView>
   );
};
// Definindo os estilos que estavam faltando
const styles = StyleSheet.create({
   container: {
       flex: 1,
       backgroundColor: '#f5f5f5',
   },
   content: {
       padding: 20,
   },
   nicknameContainer: {
       backgroundColor: '#fff',
       borderRadius: 10,
       padding: 20,
       marginBottom: 20,
       alignItems: 'center',
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.1,
       shadowRadius: 4,
       elevation: 2,
   },
   label: {
       fontSize: 14,
       color: '#666',
       marginBottom: 8,
   },
   nickname: {
       fontSize: 24,
       fontWeight: 'bold',
       color: '#2196F3',
   },
   shareButton: {
       backgroundColor: '#2196F3',
       borderRadius: 8,
       paddingVertical: 15,
       paddingHorizontal: 20,
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'center',
       marginBottom: 25,
   },
   shareButtonText: {
       color: '#fff',
       marginLeft: 10,
       fontSize: 16,
       fontWeight: '500',
   },
   infoContainer: {
       backgroundColor: '#fff',
       borderRadius: 10,
       padding: 20,
       marginBottom: 20,
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.1,
       shadowRadius: 4,
       elevation: 2,
   },
   infoTitle: {
       fontSize: 18,
       fontWeight: 'bold',
       color: '#333',
       marginBottom: 12,
   },
   infoText: {
       fontSize: 15,
       color: '#555',
       lineHeight: 22,
   },
});
export default ReceiveMoneyScreen;