import { Stack } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View,Image } from 'react-native';

export default function Home() {
  return (
    <>
      <Stack.Screen />
      <Text>Wed 13, Sep · 1930 CET  </Text>
      {/* <Text style={{fontSize:30,fontWeight:"bold"}}>This is the title</Text> */}

      <Text className='text-2xl font-bold'>This is the title</Text>
      <Text>City Hall</Text>
      {/* Event Image */}
      <Image source={{uri:"https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/1.jpg"}} style={{width:200,height:200}} />

      {/* Footer */}
      <Text>16 going</Text>
      <Feather name="share" size={18} color="black"/>
      <FontAwesome name="bookmark" size={24} color="black" />
    </>
  );
}
