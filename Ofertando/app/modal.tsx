import { View, Text, TextInput, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function Modal() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-2xl font-bold text-center mb-6">Fale com a gente</Text>

      <TextInput placeholder="Seu nome" className="border border-gray-300 p-3 rounded mb-4" />
      <TextInput placeholder="Seu e-mail" className="border border-gray-300 p-3 rounded mb-4" keyboardType="email-address" />
      <TextInput placeholder="Sua mensagem" className="border border-gray-300 p-3 rounded mb-6" multiline numberOfLines={4} />

      <View className="flex-row justify-end space-x-3">
        <Pressable
          onPress={() => router.back()}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          <Text>Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            // Enviar dados aqui
            router.back();
          }}
          className="bg-orange-500 px-4 py-2 rounded"
        >
          <Text className="text-white font-bold">Enviar</Text>
        </Pressable>
      </View>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
