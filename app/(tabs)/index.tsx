import { Stack } from 'expo-router';
import { View } from 'react-native';
import EventListItem  from '../../components/EventListItem';

export default function Home() {
  return (
    <>
      <Stack.Screen />

      {/* Event Cards Container */}
      <View className="mx-2 my-2 gap-2">
        <EventListItem />
        <EventListItem />
      </View>
    </>
  );
}