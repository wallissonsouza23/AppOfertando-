import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import CommentItem from '../../components/CommentItem';
import axios from 'axios';
import { useAuth } from '../../utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, router } from 'expo-router';
import { CardHorizontalFood } from '../../components/ProductDetailsCard';
import { API_BASE } from '../../utils/api';

export type Comment = {
  id: string;
  text: string;
  likes: number;
  user: {
    id: string;
    nome: string;
    avatarUrl?: string;
  };
  createdAt: string;
  replies?: Comment[];
};

export type FoodProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  market: {
    name: string;
    verified: boolean;
    rating: number;
  };
  userLikePercentage?: number;
};

export default function Produto({ productId: propProductId }: { productId?: string }) {
  const routeParams = useLocalSearchParams();
  const idFromRoute = typeof routeParams.id === 'string' ? routeParams.id : '1';
  const productId = propProductId || idFromRoute;

  const { user } = useAuth();
  const userId = user?.id ?? '';

  const [produto, setProduto] = useState<FoodProps | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const [commentText, setCommentText] = useState('');
  const [sortByNewest, setSortByNewest] = useState(true);

  const fetchProduto = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products/${productId}`);
      setProduto(res.data);
    } catch {
      Alert.alert('Erro', 'Produto não encontrado.');
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/products/${productId}/comments?sort=${sortByNewest ? 'newest' : 'oldest'}`
      );
      setComments(res.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os comentários.');
    }
  };

  const fetchLikedComments = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(
        `${API_BASE}/users/${userId}/liked-comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikedComments(res.data);
    } catch (err) {
      console.log('Erro ao buscar likes', err);
    }
  };
  const confirmDelete = (id: string) => {
    Alert.alert(
      'Excluir comentário',
      'Tem certeza que deseja excluir este comentário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => handleDeleteComment(id) },
      ]
    );
  };


  useEffect(() => {
    fetchProduto();
  }, [productId]);

  useEffect(() => {
    if (userId) {
      fetchComments();
      fetchLikedComments();
    }
  }, [userId, sortByNewest, productId]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.post(
        `${API_BASE}/products/${productId}/comments`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([res.data, ...comments]);
      setCommentText('');
    } catch {
      Alert.alert('Erro', 'Não foi possível adicionar o comentário.');
    }
  };

  const handleEditComment = async (commentId: string, newText: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.put(
        `${API_BASE}/products/${productId}/comments/${commentId}`,
        { text: newText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updateText = (items: Comment[]): Comment[] =>
        items.map((item) => ({
          ...item,
          text: item.id === commentId ? newText : item.text,
          replies: item.replies ? updateText(item.replies) : [],
        }));

      setComments((prev) => updateText(prev));
    } catch {
      Alert.alert('Erro', 'Não foi possível editar o comentário.');
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.delete(
        `${API_BASE}/products/${productId}/comments/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const removeRecursively = (items: Comment[]): Comment[] =>
        items
          .filter((c) => c.id !== id)
          .map((c) => ({
            ...c,
            replies: c.replies ? removeRecursively(c.replies) : [],
          }));

      setComments((prev) => removeRecursively(prev));
      setLikedComments((prev) => prev.filter((cid) => cid !== id));
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir o comentário.');
    }
  };

  const handleToggleLike = async (commentId: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.patch(
        `${API_BASE}/products/${productId}/comments/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updateLikes = (items: Comment[]): Comment[] =>
        items.map((item) => {
          if (item.id === commentId) {
            const alreadyLiked = likedComments.includes(commentId);
            return {
              ...item,
              likes: alreadyLiked ? Math.max(0, item.likes - 1) : item.likes + 1,
            };
          }
          return {
            ...item,
            replies: item.replies ? updateLikes(item.replies) : [],
          };
        });

      setComments((prev) => updateLikes(prev));
      setLikedComments((prev) =>
        prev.includes(commentId)
          ? prev.filter((id) => id !== commentId)
          : [...prev, commentId]
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível curtir o comentário.');
    }
  };

  const handleReply = async (parentId: string, text: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.post(
        `${API_BASE}/products/${productId}/comments`,
        { text, parentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const insertReply = (items: Comment[]): Comment[] =>
        items.map((item) => ({
          ...item,
          replies: item.id === parentId
            ? [res.data, ...(item.replies || [])]
            : item.replies
              ? insertReply(item.replies)
              : [],
        }));

      setComments((prev) => insertReply(prev));
    } catch {
      Alert.alert('Erro', 'Não foi possível responder ao comentário.');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="flex-row justify-between items-center px-4 py-3 bg-white shadow z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-orange-500 items-center justify-center"
        >
          <Feather name="arrow-left" size={20} color="white" />
        </TouchableOpacity>

        <View className="flex-1 px-4 items-center">
          <Text className="text-xxs font-bold text-gray-700">Vendido por</Text>
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-orange-500 mr-1">
              {produto?.market.name}
            </Text>
            {produto?.market.verified && (
              <Feather name="check-circle" size={14} color="#22c55e" />
            )}
          </View>
        </View>

        <TouchableOpacity className="w-10 h-10 rounded-full bg-orange-500 items-center justify-center">
          <Feather name="more-horizontal" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 bg-white" keyboardShouldPersistTaps="handled">
        <View className="px-4 pt-4">
          {produto && <CardHorizontalFood food={produto} />}
        </View>

        <View className="my-6 h-px bg-gray-300 mx-4" />

        <View className="px-4 pb-8">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xl font-bold text-gray-800">Comentários</Text>
            {comments.length > 0 && (
              <Text className="text-sm text-gray-500">{comments.length} comentário(s)</Text>
            )}
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">
              Ordenar: {sortByNewest ? 'Mais recentes' : 'Mais antigos'}
            </Text>
            <TouchableOpacity onPress={() => setSortByNewest(!sortByNewest)}>
              <Feather name="refresh-ccw" size={18} color="#333" />
            </TouchableOpacity>
          </View>

          <View className="mt-4 space-y-3">
            <TextInput
              className="border border-gray-300 p-3 rounded-xl text-black bg-white"
              placeholder="Deixe seu comentário..."
              multiline
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity
              onPress={handleAddComment}
              className="bg-green-600 py-3 px-4 rounded-full items-center flex-row justify-center"
            >
              <Feather name="send" size={16} color="white" />
              <Text className="text-white font-semibold ml-2">Enviar</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-6 space-y-2">
            {comments.length === 0 ? (
              <Text className="text-sm text-gray-500">Nenhum comentário ainda.</Text>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={userId}
                  onDelete={confirmDelete}
                  onReply={handleReply}
                  onLike={handleToggleLike}
                  onEdit={handleEditComment}
                  likedComments={likedComments}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
