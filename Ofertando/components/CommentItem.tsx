import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

type Comment = {
  id: string;
  text: string;
  user: { id: string; nome: string };
};

type Props = {
  comment: Comment;
  currentUserId: string | null;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newText: string) => void;
};

export default function CommentItem({ comment, currentUserId, onDelete, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const canEdit = currentUserId === comment.user.id;

  function handleSave() {
    if (editedText.trim() === '') return;
    onUpdate(comment.id, editedText.trim());
    setIsEditing(false);
  }

  return (
    <View className="mt-2 bg-gray-100 p-3 rounded-lg">
      {isEditing ? (
        <>
          <TextInput
            value={editedText}
            onChangeText={setEditedText}
            multiline
            className="border p-2 rounded"
          />
          <View className="flex-row mt-2 space-x-2">
            <TouchableOpacity
              onPress={handleSave}
              className="bg-green-500 px-3 py-1 rounded"
            >
              <Text className="text-white font-semibold">Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setEditedText(comment.text);
                setIsEditing(false);
              }}
              className="bg-gray-400 px-3 py-1 rounded"
            >
              <Text className="text-white font-semibold">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text className="text-sm text-gray-800">{comment.text}</Text>
          <Text className="text-xs text-gray-500 mt-1">— {comment.user.nome}</Text>

          {canEdit && (
            <View className="flex-row mt-2 space-x-2">
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="px-2 py-1 bg-yellow-400 rounded"
              >
                <Text className="text-xs text-white">Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onDelete(comment.id)}
                className="px-2 py-1 bg-red-500 rounded"
              >
                <Text className="text-xs text-white">Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}
