// app/cadastro.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../utils/auth'; // Importe useAuth
import { MaterialIcons, Feather } from '@expo/vector-icons';

export default function CadastroScreen() {
  const router = useRouter();
  const { signUp, loading: authLoading } = useAuth(); // Obtenha signUp e authLoading

  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Local loading para o botão

  const [senhaError, setSenhaError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // ... (suas funções de validação existentes) ...
  const validaEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);
  const validaData = (value: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(value);
  const validaTelefone = (value: string) => /^\(\d{2}\)\d{4,5}-\d{4}$/.test(value);

  const validaSenha = (value: string) => {
    if (value.length < 6) return 'Senha deve ter ao menos 6 caracteres.';
    if (!/[A-Za-z]/.test(value)) return 'Senha deve conter pelo menos uma letra.';
    if (!/\d/.test(value)) return 'Senha deve conter pelo menos um número.';
    return '';
  };

  const handleDataChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
    if (cleaned.length > 4) {
      cleaned = cleaned.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    } else if (cleaned.length > 2) {
      cleaned = cleaned.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }
    setDataNascimento(cleaned);
  };

  const handleTelefoneChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);

    if (cleaned.length > 6) {
      cleaned = cleaned.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1)$2-$3');
    } else if (cleaned.length > 2) {
      cleaned = cleaned.replace(/^(\d{2})(\d{0,5})/, '($1)$2');
    } else if (cleaned.length > 0) {
      cleaned = cleaned.replace(/^(\d{0,2})/, '($1');
    }
    setTelefone(cleaned);
  };
  // ... (fim das suas funções de validação existentes) ...


  useEffect(() => {
    const senhaValidationMsg = validaSenha(senha);
    setSenhaError(senhaValidationMsg);

    const formValid =
      nome.trim().length > 0 &&
      validaData(dataNascimento) &&
      validaTelefone(telefone) &&
      validaEmail(email) &&
      senhaValidationMsg === '' &&
      senha === confirmarSenha;

    setIsFormValid(formValid);
  }, [nome, dataNascimento, telefone, email, senha, confirmarSenha]);

  const handleCadastro = async () => {
  if (!isFormValid) {
    Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente antes de continuar.');
    return;
  }

  setIsLoading(true); // Ativa loading local
  try {
    const [d, m, y] = dataNascimento.split('/');
    const isoDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;

    await signUp(nome, isoDate, telefone, email, senha); // Chama o signUp do useAuth
    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
      {
        text: 'OK',
        // MODIFICAÇÃO AQUI: Passar o email como parâmetro para a tela de login
        onPress: () => router.push({ pathname: '/login', params: { registeredEmail: email } })
      }
    ]);
  } catch (error: any) {
    console.error('Erro no cadastro:', error.message);
    Alert.alert('Erro', error.message || 'Falha ao cadastrar usuário.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.containerLogo}>
          <Animatable.Image
            animation="flipInY"
            source={require('../assets/logo.png')}
            style={{ width: '40%', resizeMode: 'contain', alignSelf: 'center' }}
          />
          <Animatable.Text animation="flipInY" style={styles.titleApp}>Ofertando</Animatable.Text>
        </View>

        <Animatable.View animation="fadeInUp" style={styles.containerForm}>

          {/* Nome */}
          <Text style={styles.title}>Nome completo</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={24} color="#f97316" />
            <TextInput
              placeholder="Digite seu nome"
              style={styles.input}
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* Data de Nascimento */}
          <Text style={styles.title}>Data de nascimento</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="calendar-today" size={24} color="#f97316" />
            <TextInput
              placeholder="dd/mm/yyyy"
              style={styles.input}
              value={dataNascimento}
              onChangeText={handleDataChange}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* Telefone */}
          <Text style={styles.title}>Telefone</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="phone" size={24} color="#f97316" />
            <TextInput
              placeholder="(00)00000-0000"
              style={styles.input}
              value={telefone}
              onChangeText={handleTelefoneChange}
              keyboardType="phone-pad"
              maxLength={14}
            />
          </View>

          {/* Email */}
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

          {/* Senha */}
          <Text style={styles.title}>Senha</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="#f97316" />
            <TextInput
              placeholder="Digite sua senha"
              style={[styles.input, senhaError ? { borderColor: 'red', borderWidth: 1 } : null]}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Feather name={passwordVisible ? 'eye-off' : 'eye'} size={22} color="#f97316" />
            </TouchableOpacity>
          </View>
          {senhaError ? <Text style={styles.errorText}>{senhaError}</Text> : null}

          {/* Confirmar Senha */}
          <Text style={styles.title}>Confirmar Senha</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="#f97316" />
            <TextInput
              placeholder="Confirme sua senha"
              style={styles.input}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!confirmPasswordVisible}
            />
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              <Feather name={confirmPasswordVisible ? 'eye-off' : 'eye'} size={22} color="#f97316" />
            </TouchableOpacity>
          </View>

          {/* Botão Cadastrar */}
          <TouchableOpacity
            style={[styles.button, (!isFormValid || isLoading || authLoading) && styles.buttonDisabled]} // Use authLoading também
            onPress={handleCadastro}
            disabled={!isFormValid || isLoading || authLoading}
          >
            {(isLoading || authLoading) ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
          </TouchableOpacity>

          {/* Link para Login */}
          <TouchableOpacity style={styles.buttonRegister} onPress={() => router.push('/login')}>
            <Text style={styles.textBase}>
              Já tem uma conta? <Text style={styles.textLink}>Faça login</Text>
            </Text>
          </TouchableOpacity>

        </Animatable.View>

        <View style={styles.footerContainer} />

      </ScrollView>
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
  footerContainer: { marginTop: 70 },
  errorText: { color: 'red', fontSize: 12, marginBottom: 8, marginLeft: 8 }
});