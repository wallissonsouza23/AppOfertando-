// app/login.tsx
import React, { useState, useEffect } from 'react'; // Adicionado useEffect para usar useLocalSearchParams
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Importe useLocalSearchParams
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../utils/auth';
import { MaterialIcons, Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading local para o botão

  // NOVO: Hook para pegar os parâmetros da URL
  const params = useLocalSearchParams();

  // NOVO: useEffect para preencher o email se houver um parâmetro 'registeredEmail'
  useEffect(() => {
    if (params.registeredEmail) {
      setEmail(params.registeredEmail as string); // Define o email com o valor passado
    }
  }, [params.registeredEmail]); // O useEffect será executado quando registeredEmail mudar nos parâmetros

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) { // Adicionado .trim() para evitar espaços em branco
      Alert.alert('Erro', 'Por favor, preencha seu e-mail e senha.');
      return;
    }

    setIsLoading(true); // Ativa loading local
    try {
      await signIn(email, senha); // Chama o signIn do useAuth (que agora usa sua API real)
      // Se o login for bem-sucedido, o `AuthContext` irá atualizar o `user` e o `_layout.tsx`
      // automaticamente redirecionará para a tela principal (home).
      // Não precisamos de Alert.alert('Sucesso', 'Login realizado com sucesso!');
      // nem router.replace('/home'); aqui, pois o _layout.tsx já cuida disso
      // ao detectar que `user` não é null.
    } catch (error: any) {
      console.error('Erro no login:', error.message);
      // Exibe a mensagem de erro que veio do `auth.ts` (que por sua vez veio do backend)
      Alert.alert('Erro', error.message || 'Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false); // Desativa loading local
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.containerLogo}>
        <Animatable.Image
          animation="flipInY"
          source={require('../assets/logo.png')}
          style={{ width: '40%', resizeMode: 'contain', alignSelf: 'center' }}
        />
        <Animatable.Text animation="flipInY" style={styles.titleApp}>Ofertando</Animatable.Text>
      </View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Email</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="#f97316" />
          <TextInput
            placeholder="Digite seu email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.title}>Senha</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#f97316" />
          <TextInput
            placeholder="Digite sua senha"
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Feather name={passwordVisible ? 'eye-off' : 'eye'} size={22} color="#f97316" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/replacePass')}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, (isLoading || authLoading) && styles.buttonDisabled]} // Use authLoading também
          onPress={handleLogin}
          disabled={isLoading || authLoading}
        >
          {(isLoading || authLoading) ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Acessar</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonRegister} onPress={() => router.push('/cadastro')}>
          <Text style={styles.textBase}>
            Não tem uma conta? <Text style={styles.textLink}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  containerLogo: { marginTop: -200, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  titleApp: { fontSize: 30, fontWeight: 'bold', color: '#000', marginTop: -250 },
  containerForm: { flex: 1, backgroundColor: '#f5f5f5', borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingHorizontal: '5%' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#000', marginTop: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ebebeb', borderRadius: 10, paddingHorizontal: 10, marginBottom: 12, borderWidth: 1, borderColor: '#000' },
  input: { flex: 1, height: 40, fontSize: 16, fontStyle: 'italic', paddingHorizontal: 10 },
  button: { backgroundColor: '#ff7000', width: '80%', borderRadius: 50, paddingVertical: 8, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  buttonRegister: { marginTop: 10, alignSelf: 'center' },
  textBase: { color: '#000', fontSize: 14 },
  textLink: { color: '#f97316', fontWeight: 'bold', textDecorationLine: 'underline' },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 10 },
  forgotPasswordText: { fontSize: 14, color: '#f97316' },
});