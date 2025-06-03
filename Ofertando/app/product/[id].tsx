import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import CommentItem from '../../components/CommentItem'; // ajuste o caminho conforme seu projeto
import { FoodProps } from '../../types/FoodProps';

// Tipagem para comentário
type Comment = {
  id: string;
  text: string;
  user: { id: string; nome: string };
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState<FoodProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado dos comentários
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  // Simulação de usuário logado
  const userId = 'user123'; // Troque para o ID real do usuário logado
  const userName = 'Usuário Atual'; // Nome do usuário atual

  // Carregar produto
  useEffect(() => {
    async function fetchProductById() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://172.20.10.2:3000/products/${id}`);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Erro ${response.status}: ${text}`);
        }
        const data = await response.json();

        const transformedData: FoodProps = {
          ...data,
          price: parseFloat(data.price),
          userLikePercentage: Number(data.userLikePercentage),
          market: {
            ...data.market,
            rating: parseFloat(data.market.rating),
          }
        };

        setProduct(transformedData);
      } catch (err) {
        setError('Não foi possível carregar os detalhes do produto. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProductById();
      fetchComments();
    }
  }, [id]);

  // Função para buscar comentários
  async function fetchComments() {
    try {
      const res = await fetch(`http://172.20.10.2:3000/products/${id}/comments`);
      if (!res.ok) throw new Error('Erro ao buscar comentários');
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  }

  // Criar novo comentário
  async function handleAddComment() {
    if (commentText.trim() === '') return;

    try {
      const res = await fetch(`http://192.168.1.7:3000/products/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: commentText.trim(),
          userId,
          userName,
        }),
      });
      if (!res.ok) throw new Error('Erro ao adicionar comentário');
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  }

  // Atualizar comentário
  async function handleUpdateComment(commentId: string, newText: string) {
    try {
      const res = await fetch(`http://192.168.1.7:3000/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText }),
      });
      if (!res.ok) throw new Error('Erro ao atualizar comentário');
      const updatedComment = await res.json();

      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? updatedComment : comment))
      );
    } catch (err) {
      console.error(err);
    }
  }

  // Excluir comentário
  async function handleDeleteComment(commentId: string) {
    try {
      const res = await fetch(`http://192.168.1.7:3000/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao deletar comentário');
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return <Text className="text-center mt-10">Carregando...</Text>;
  }

  if (error) {
    return <Text className="text-center mt-10 text-red-500">{error}</Text>;
  }

  if (!product) {
    return <Text className="text-center mt-10">Produto não encontrado.</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View className="flex-row items-center flex-1 justify-center">
          <Text className="text-lg font-semibold text-gray-800">
            Vendido por {product.market.name}
          </Text>
          {product.market.verified && (
            <Feather name="check-circle" size={16} color="#09aa09" className="ml-1" />
          )}
        </View>

        <TouchableOpacity onPress={() => console.log('Opções clicadas')} className="p-2">
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps="handled">
        <Image source={{ uri: product.image }} className="w-full h-64 rounded-2xl" resizeMode="cover" />

        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-800">{product.name}</Text>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="#444" />
          </TouchableOpacity>
        </View>

        <Text className="text-xl text-orange-500 font-semibold">
          {typeof product.price === 'number' ? `R$ ${product.price.toFixed(2).replace('.', ',')}` : 'Preço indisponível'}
        </Text>

        <View className="flex-row items-center mt-2">
          <Text className="text-base text-gray-700">{product.market.name}</Text>
          {product.market.verified && (
            <Feather name="check-circle" size={16} color="#09aa09" className="ml-1" />
          )}
          <Ionicons name="star" size={16} color="#FFA500" className="ml-2" />
          <Text className="ml-1 text-gray-600 text-sm">{product.market.rating.toFixed(1)}</Text>
        </View>

        <TouchableOpacity className="mt-4 bg-orange-500 py-2 rounded-xl items-center">
          <Text className="text-white font-semibold">Comparar Preço</Text>
        </TouchableOpacity>

        {/* Seção de Avaliações Dinâmicas */}
        <Text className="mt-6 text-base font-semibold text-gray-800">Avaliações</Text>

        {/* Input para novo comentário */}
        <View className="mt-4">
          <TextInput
            className="border p-2 rounded"
            placeholder="Deixe seu comentário"
            multiline
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity
            onPress={handleAddComment}
            className="mt-2 bg-green-500 py-2 rounded-xl items-center"
          >
            <Text className="text-white font-semibold">Enviar Comentário</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de comentários */}
        {comments.length === 0 ? (
          <Text className="text-sm text-gray-500 mt-2">Nenhum comentário ainda.</Text>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={userId}
              onDelete={handleDeleteComment}
              onUpdate={handleUpdateComment}
            />
          ))
        )}

        {/* Exemplo estático que você tinha */}
        {product.userLikePercentage !== undefined && (
          <View className="mt-4 flex-row items-center">
            <AntDesign name="like1" size={16} color="#09aa09" />
            <Text className="ml-1 text-green-700 text-sm">
              {product.userLikePercentage}% dos usuários gostaram
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
