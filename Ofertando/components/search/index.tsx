import { Feather } from '@expo/vector-icons';
import { View, TextInput } from 'react-native';


export function Search() {
 return (
   <View className='w-full flex-row border border-slate-500 h-14 rounded-full items-center gap-2 px-4 bg-transparent' >
    <Feather name='search' size={24} color="#ff7000" />

    <TextInput
     placeholder="Procure seu Produto..."
     className='w-full h-full flex-1 bg-transparent'
    />
   </View>
  );
}