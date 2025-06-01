// components/Header.tsx
import { View, Pressable, Text } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; 

export function Header() { 
  const navigation = useNavigation(); 

  return (
    <View className="w-full flex flex-row bg-orange-500 items-center justify-between px-4 py-2">
      <Pressable 
       
        onPress={() => (navigation as any).openDrawer()} 
        className="w-10 h-10 justify-center items-center rounded-full"
      >
        <Ionicons name="menu" size={25} color="#fff"/> 
      </Pressable>

      <View className="items-center">
        <Text className="text-sm text-white">Localização</Text>
        <View className="flex-row items-center gap-1">
          <Feather name="map-pin" size={15} color={"#fff"} />
          <Text className="text-lg font-bold text-white">Taguatinga DF</Text>
        </View>
      </View>

      <Pressable
  onPress={() => (navigation as any).navigate('notifications')}

  className="w-10 h-10 justify-center items-center rounded-full"
>
  <Feather name="bell" size={25} color="#fff" />
</Pressable>

    </View>
  );
}