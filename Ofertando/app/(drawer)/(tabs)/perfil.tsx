// app/(drawer)/(tabs)/perfil.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
  Switch, ScrollView, Alert, Platform, ActivityIndicator,
  TextInput
} from 'react-native';
import { useAuth } from '../../../utils/auth';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const API_BASE = 'http://172.20.10.2:3000'; // Certifique-se de que este IP é o correto para o seu backend

const ProfileScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const { user, loading: authLoading, signOut, getToken, updateUser } = useAuth();

  const [modoEscuro, setModoEscuro] = useState(false);
  const [modoSilencioso, setModoSilencioso] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableNome, setEditableNome] = useState(user?.nome || '');
  const [editableTelefone, setEditableTelefone] = useState(user?.telefone || '');


  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
    if (user) {
      console.log('Frontend (perfil.tsx): Dados do usuário no AuthContext (após atualização):', user);
      console.log('Frontend (perfil.tsx): avatarUrl NO ESTADO DO FRONTEND (useEffect):', user.avatarUrl);
      setEditableNome(user.nome || '');
      setEditableTelefone(user.telefone || '');
      console.log('Frontend (perfil.tsx): user.avatarUrl:', user.avatarUrl);
      console.log('Frontend (perfil.tsx): user.nome:', user.nome);
      console.log('Frontend (perfil.tsx): user.telefone:', user.telefone);
      console.log('Frontend (perfil.tsx): user.dataNascimento:', user.dataNascimento);
    }
  }, [user, authLoading, router]);

  // ESTA É A ÚNICA DEFINIÇÃO DE handlePickAndUploadAvatar QUE DEVE EXISTIR
  const handlePickAndUploadAvatar = async () => {
    if (!user) {
      Alert.alert('Erro', 'Nenhum usuário autenticado.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Desculpe, precisamos de permissões de câmera para isso funcionar!');
      return;
    }

    try {
      setUploading(true);

      // Mantenha seus console.logs aqui para depuração:
      console.log('Objeto ImagePicker:', ImagePicker);

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (pickerResult.canceled) {
        console.log('Seleção de imagem cancelada.');
        return;
      }

      if (!pickerResult.assets || pickerResult.assets.length === 0 || !pickerResult.assets[0].uri) {
        Alert.alert('Erro', 'Nenhuma imagem selecionada ou URI inválida.');
        return;
      }

      const token = await getToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const formData = new FormData();
      const localUri = pickerResult.assets[0].uri;
      console.log('Frontend (perfil.tsx): URI da imagem selecionada (localUri):', localUri);
      const filename = localUri.split('/').pop() || `avatar_${user.id}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('file', {
        uri: Platform.OS === 'ios' ? localUri.replace('file://', '') : localUri,
        name: filename,
        type,
      } as any);

      console.log('Frontend (perfil.tsx): Enviando requisição POST para:', `${API_BASE}/user/upload-avatar`);
      const response = await axios.post(`${API_BASE}/user/upload-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        timeout: 10000,
      });

      console.log('Frontend (perfil.tsx): Resposta do upload de avatar:', response.data);
      let newAvatarRelativeUrl = response.data.avatarUrl;


      if (newAvatarRelativeUrl && newAvatarRelativeUrl.startsWith(API_BASE)) {
        newAvatarRelativeUrl = newAvatarRelativeUrl.substring(API_BASE.length);
      }
      if (newAvatarRelativeUrl && !newAvatarRelativeUrl.startsWith('/')) {
        newAvatarRelativeUrl = '/' + newAvatarRelativeUrl;
      }

      if (updateUser) {
        updateUser({ avatarUrl: newAvatarRelativeUrl });
        console.log('Frontend (perfil.tsx): Chamando updateUser com avatarUrl (FINAL):', newAvatarRelativeUrl);
      }

      Alert.alert('Sucesso', 'Avatar atualizado com sucesso!');

    } catch (error: any) {
      console.error('Erro no upload do avatar:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        Alert.alert('Erro de Autenticação', 'Sessão expirada. Por favor, faça login novamente.');
        signOut();
        router.replace('/login');
      } else if (error.response?.data?.message) {
        Alert.alert('Erro', 'Falha ao enviar avatar: ' + error.response.data.message);
      } else if (error.message.includes('Network Error')) {
        Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão ou o IP do servidor.');
      }
      else {
        Alert.alert('Erro', 'Falha ao enviar avatar: ' + error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) {
      Alert.alert('Erro', 'Nenhum usuário autenticado.');
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const updatedData = {
        nome: editableNome,
        telefone: editableTelefone,
      };

      console.log('Frontend (perfil.tsx): Enviando PATCH para atualizar perfil:', updatedData);
      const response = await axios.patch(`${API_BASE}/user/${user.id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Frontend (perfil.tsx): Resposta da atualização do perfil:', response.data);

      if (updateUser) {
        updateUser(response.data);
      }

      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error.response?.data || error.message);
      Alert.alert('Erro', 'Falha ao salvar perfil: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      Alert.alert('Erro', 'Nenhum usuário autenticado.');
      return;
    }

    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await getToken();
              if (!token) {
                throw new Error('Token de autenticação não encontrado.');
              }
              await axios.delete(`${API_BASE}/user/${user.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              await signOut();
              router.replace('/login');
              Alert.alert('Conta excluída', 'Sua conta foi removida com sucesso.');
            } catch (err: any) {
              console.error('Erro ao excluir conta:', err.response?.data || err.message);
              Alert.alert('Erro', 'Não foi possível excluir sua conta: ' + (err.response?.data?.message || err.message));
            }
          },
        },
      ]
    );
  };

  const renderProfileItem = (icon: keyof typeof MaterialIcons.glyphMap, label: string, value: string | undefined | null, isEditable: boolean, onValueChange: (text: string) => void) => (
    <View style={styles.item}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={30} color="#fff" />
      </View>
      <View style={styles.itemContent}>
        {isEditing && isEditable ? (
          <TextInput
            style={styles.editableInput}
            value={value || ''}
            onChangeText={onValueChange}
            placeholder={label}
            placeholderTextColor="#999"
          />
        ) : (
          <Text style={styles.itemValue}>{value || `N/A`}</Text>
        )}
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
    </View>
  );

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
        <Text>Carregando dados do usuário...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Nenhum usuário logado. Redirecionando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.headerBack} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={30} color="#FFA500" />
      </TouchableOpacity>

      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handlePickAndUploadAvatar} disabled={uploading}>
          {uploading ? (
            <View style={styles.avatarLoadingContainer}>
              <ActivityIndicator size="small" color="#FFA500" />
            </View>
          ) : (
            <>
              {console.log('Frontend (perfil.tsx): URI COMPLETA da imagem para exibição (APÓS AJUSTE):', user.avatarUrl ? `${API_BASE}${user.avatarUrl}` : 'https://i.pravatar.cc/150?img=65')}
              <Image
                source={{
                  uri: user.avatarUrl
                    ? `${API_BASE}${user.avatarUrl}?cache=${new Date().getTime()}` // Adiciona timestamp para evitar cache
                    : 'https://i.pravatar.cc/150?img=65',
                }}
                style={styles.avatar}
                onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)} // <--- Adicionado
                onLoad={() => console.log('Imagem carregada com sucesso!')} // <--- Adicionado
              />
            </>
          )}
          <Text style={styles.changePhotoText}>Alterar foto</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.userName}>{user.nome || 'Nome do Usuário'}</Text>
          <Text style={styles.online}>● Online</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Dados da Conta</Text>

      {renderProfileItem('person', 'Nome', editableNome, true, setEditableNome)}
      {renderProfileItem('email', 'E-mail', user.email, false, () => { })}
      {renderProfileItem('phone', 'Telefone', editableTelefone, true, setEditableTelefone)}
      {user.dataNascimento && renderProfileItem(
        'cake',
        'Nascimento',
        new Date(user.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        false,
        () => { }
      )}

      <View style={styles.editButtonsContainer}>
        {isEditing ? (
          <>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} disabled={uploading}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => { setIsEditing(false); setEditableNome(user.nome || ''); setEditableTelefone(user.telefone || ''); }} disabled={uploading}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>Configuração</Text>
      <View style={styles.item}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="language" size={22} color="#fff" />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemValue}>Português</Text>
          <Text style={styles.itemLabel}>Linguagem</Text>
        </View>
      </View>

      <View style={styles.switchItem}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="notifications-off" size={22} color="#fff" />
        </View>
        <Text style={styles.switchLabel}>Modo Silencioso</Text>
        <Switch value={modoSilencioso} onValueChange={setModoSilencioso} thumbColor="#FFA500" />
      </View>

      <View style={styles.switchItem}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="dark-mode" size={22} color="#fff" />
        </View>
        <Text style={styles.switchLabel}>Modo Escuro</Text>
        <Switch value={modoEscuro} onValueChange={setModoEscuro} thumbColor="#FFA500" />
      </View>

      <View style={styles.item}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="settings" size={22} color="#fff" />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemValue}>Câmera, Local, & Microfone</Text>
          <Text style={styles.itemLabel}>Permissões</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleDeleteAccount}>
        <Text style={styles.logoutText}>Excluir Conta</Text>
      </TouchableOpacity>

      <Text style={styles.privacy}>Privacidade & Política</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  headerBack: { marginTop:20,
    margin: 10,
   },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    gap: 15,
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  avatarLoadingContainer: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  changePhotoText: { color: '#FFA500', fontSize: 12, textAlign: 'center', marginTop: 4 },
  userName: { fontSize: 18, fontWeight: 'bold' },
  online: { color: 'green', fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  iconContainer: {
    backgroundColor: '#FFA500',
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  itemContent: { flex: 1 },
  itemValue: { fontSize: 14, color: '#333' },
  itemLabel: { fontSize: 12, color: '#777' },
  editableInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderColor: '#FFA500',
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
  },
  switchLabel: { flex: 1, fontSize: 14 },
  logoutButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  privacy: { textAlign: 'center', color: '#888', fontSize: 12, marginBottom: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#DC3545',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;