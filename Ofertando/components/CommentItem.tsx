import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

type User = {
  id: string;
  nome: string;
  avatarUrl?: string;
};

export type Comment = {
  id: string;
  text: string;
  likes: number;
  user: User;
  createdAt: string;
  parentComment?: Comment;
  replies?: Comment[];
};

type Props = {
  comment: Comment;
  currentUserId: string;
  onDelete: (id: string) => void;
  onReply: (parentId: string, text: string) => void;
  onLike: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  likedComments: string[];
};

export default function CommentItem({
  comment,
  currentUserId,
  onDelete,
  onReply,
  onLike,
  onEdit,
  likedComments,
}: Props) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  useEffect(() => {
    setEditedText(comment.text);
  }, [comment.text]);

  const isLiked = likedComments.includes(comment.id);
  const likeCount = typeof comment.likes === 'number' && !isNaN(comment.likes) ? comment.likes : 0;

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText);
    setReplyText('');
    setShowReplyBox(false);
  };

  const handleSaveEdit = () => {
    if (!editedText.trim()) return;
    onEdit(comment.id, editedText);
    setIsEditing(false);
  };

  return (
    <View className="bg-white border border-gray-200 rounded-2xl p-4 mt-4 ml-1 shadow-sm">
      {/* Cabeçalho com avatar e nome */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center space-x-3">
          {comment.user?.avatarUrl ? (
            <Image
              source={{ uri: `http://192.168.1.7:3000${comment.user.avatarUrl}` }}
              className="w-9 h-9 rounded-full"
            />
          ) : (
            <View className="w-9 h-9 rounded-full bg-gray-300" />
          )}
          <View>
            <Text className="font-semibold text-gray-800 text-sm">
              {comment.user?.nome || 'Usuário'}
            </Text>
            <Text className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
              })}
            </Text>
          </View>
        </View>

        {comment.user?.id === currentUserId && (
          <View className="flex-row space-x-2">
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Feather name="edit-2" size={16} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(comment.id)}>
              <Feather name="trash-2" size={16} color="#F87171" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Texto ou edição */}
      {isEditing ? (
        <>
          <TextInput
            value={editedText}
            onChangeText={setEditedText}
            multiline
            className="border border-gray-300 rounded-lg mt-2 px-3 py-2 text-black bg-gray-50"
          />
          <TouchableOpacity
            onPress={handleSaveEdit}
            className="bg-blue-500 mt-2 px-4 py-2 rounded-xl self-start"
          >
            <Text className="text-white text-sm">Salvar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text className="text-sm text-gray-700 mt-2">{comment.text}</Text>
      )}

      {/* Ações */}
      <View className="flex-row items-center mt-3 space-x-5">
        <TouchableOpacity className="flex-row items-center" onPress={() => onLike(comment.id)}>
          <AntDesign name={isLiked ? 'like1' : 'like2'} size={16} color={isLiked ? '#09aa09' : '#444'} />
          <Text className="ml-1 text-gray-700">{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowReplyBox(!showReplyBox)}>
          <Feather name="message-circle" size={16} color="#444" />
        </TouchableOpacity>
      </View>

      {/* Caixa de resposta */}
      {showReplyBox && (
        <View className="mt-3 ml-1">
          <TextInput
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Responder..."
            className="border border-gray-300 rounded-lg p-2 text-black bg-gray-50"
          />
          <TouchableOpacity
            onPress={handleSendReply}
            className="bg-green-500 mt-2 px-4 py-2 rounded-xl self-start"
          >
            <Text className="text-white text-sm">Responder</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Respostas */}
      {comment.replies?.length > 0 && (
        <View className="mt-4 ml-3 border-l-[1.5px] border-gray-200 pl-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onDelete={onDelete}
              onReply={onReply}
              onLike={onLike}
              onEdit={onEdit}
              likedComments={likedComments}
            />
          ))}
        </View>
      )}
    </View>
  );
}
