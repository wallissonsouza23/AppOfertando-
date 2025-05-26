import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { redefinirSenha } from '../utils/auth'; // ajuste o caminho conforme sua estrutura
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ReplacePass() {
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  async function replacePass() {
    if (!userEmail) {
      Alert.alert('Erro', 'Por favor, insira seu email.');
      return;
    }
  
    try {
      await redefinirSenha(userEmail);
      Alert.alert('Sucesso', 'Verifique seu email para redefinir sua senha.');
      router.back();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível enviar o email.');
    }
  }
  

  return (
    <View style={styles.container}>
      <Text style={styles.titleHeader}>Redefinir Senha</Text>

      <Text style={styles.label}>Digite seu email para redefinir a senha</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="#f97316" />
        <TextInput
          placeholder="Digite seu email"
          style={styles.input}
          value={userEmail}
          onChangeText={setUserEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={replacePass}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  titleHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebebeb',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#ff7000',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
