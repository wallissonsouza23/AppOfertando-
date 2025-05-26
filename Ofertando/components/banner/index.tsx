import { View, Pressable, Text, ScrollView, Image} from 'react-native';
import PagerView from 'react-native-pager-view';
export default function Banner() {
 return (
  <View className="w-full h-36 md:h-60 rounded-2xl mt-3 mb-4">
    <PagerView style={{flex:1}} initialPage={0} pageMargin={14}>
        <Pressable className='w-full h-36 md:h-60 rounded-2xl'
        key={1}
        onPress={() => console.log("CLICOU NO BANNER 1")}>
            <Image 
            source={require("../../assets/banner2.png")}
            className='w-full h-36 md:h-60 rounded-2xl object-cover'/>
        </Pressable>
        <Pressable className='w-full h-36 md:h-60 rounded-2xl'
        key={2}
        onPress={() => console.log("CLICOU NO BANNER 2")}>
            <Image 
            source={require("../../assets/banner3.png")}
            className='w-full h-36 md:h-60 rounded-2xl object-cover'/>
        </Pressable>
    </PagerView>
  </View>
  );
}