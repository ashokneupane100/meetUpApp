import { Stack } from 'expo-router';
import { View } from 'react-native';
import EventListItem  from '@/components/EventListItem';
import events from "@/assets/events.json"


export default function Home() {
  return (
    <>
      <Stack.Screen />

      {/* Event Cards Container */}
      <View className="mx-2 my-2 gap-2">
      

        <EventListItem event={events[0]} />
         <EventListItem event={events[1]} />
          <EventListItem event={events[2]} />
           <EventListItem event={events[3]} />
            <EventListItem event={events[4]} />
             <EventListItem event={events[5]} />
      </View>
    </>
  );
}