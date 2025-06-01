// app/notifications.tsx
import { View, Text, FlatList, TouchableOpacity, Pressable } from "react-native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';

const notifications = [
    {
        id: "1",
        icon: "user",
        iconColor: "#FF9C00",
        title: "Claudia Alves",
        message: "Comentou em seu produto.",
        time: "3m ago",
    },
    {
        id: "2",
        icon: "truck",
        iconColor: "#00C853",
        title: "Entrega grátis",
        message: "Entrega grátis nos seus pedidos pedidos.",
        time: "5m ago",
    },
    {
        id: "3",
        icon: "gift",
        iconColor: "#FF6F00",
        title: "Você ganhou um cupom de 10%",
        message: "Clique e resgate o seu Cupom agora.",
        time: "9m ago",
    },
    {
        id: "4",
        icon: "user",
        iconColor: "#FF9C00",
        title: "Dani Martinez",
        message: "Comentou em seu produto.",
        time: "12m ago",
    },
    {
        id: "5",
        icon: "spotify",
        iconColor: "#1DB954",
        title: "3 meses de Spotify Premium",
        message: "Clique e conheça os serviços e condições.",
        time: "1h ago",
    },
    {
        id: "6",
        icon: "gift",
        iconColor: "#FF6F00",
        title: "Você ganhou um cupom de 60%",
        message: "Clique e resgate o seu Cupom agora.",
        time: "2h ago",
    },
];

export default function NotificationsScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="flex-1 bg-white">

            <View className="flex-row items-center px-8 py-3 bg-white border-b border-gray-200"> 
                <Pressable onPress={() => navigation.goBack()}>
                    <View className="w-10 h-10 rounded-full items-center justify-center bg-orange-500"> 
                        <Feather name="arrow-left" size={24} color="#fff" />
                    </View>
                </Pressable>
                <Text className="text-black text-2xl font-bold ml-5">Notificações</Text> 
            </View>

            {/* Conteúdo da tela */}
            <FlatList
                className="px-6 pt-2"
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="flex-row items-start gap-3 py-5 border-b border-gray-200">
                        <View
                            className="w-10 h-10 rounded-full items-center justify-center"
                            style={{ backgroundColor: item.iconColor }}
                        >
                            {item.icon === "spotify" ? (
                                <FontAwesome name="spotify" size={20} color="#fff" />
                            ) : (
                                <Feather name={item.icon as any} size={20} color="#fff" />
                            )}
                        </View>


                        <View className="flex-1">
                            <Text className="font-bold text-base">{item.title}</Text>
                            <Text className="text-sm text-gray-600">{item.message}</Text>
                        </View>

                        <View className="items-end justify-between">
                            <Text className="text-xs text-gray-400">{item.time}</Text>
                            <TouchableOpacity>
                                <MaterialIcons name="more-vert" size={18} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
