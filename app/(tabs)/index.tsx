import { Stack } from 'expo-router';
import { View, FlatList } from 'react-native';
import EventListItem from '@/components/EventListItem';
import events from '@/assets/events.json';

export default function Home() {
  return (
    <>
      <Stack.Screen />
      <FlatList
       
        data={events}
        renderItem={({ item }) => <EventListItem event={item} />}
         className="bg-white"
      />
    </>
  );
}

//implement day.js