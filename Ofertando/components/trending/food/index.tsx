import { Pressable, View, Text, Image  } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { FoodProps } from '..';
export function CardHorizontalFood({food}: {food: FoodProps}) {
 return (
   <Pressable className='flex flex-col rounded-xl relative bg-orange-100'>
    <Image
    source={{uri: food.image}}
    className='w-44 h-36 rounded-xl bg-transparent'
    />
    <Text>{food.name}</Text>
    <Text>{food.restaurantId}</Text>
    <View className='flex flex-row gap-1  right-3 py-1 px-2 items-center justify-between'>
    <Text className='text-orange-500 font-medium'>
       R$ {food.price}
    </Text>
        
        <Text className='text-green-700 text-sm '>
        <AntDesign name='like1' size={14} color={"#09aa09"} />
        {food.rating}
        </Text>
        
    </View>
   
   </Pressable>
  );
}