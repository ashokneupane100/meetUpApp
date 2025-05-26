import { useLocalSearchParams, Stack } from 'expo-router';
import { Text, View, Image, ScrollView } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import events from '@/assets/events.json';
import dayjs from 'dayjs';

export default function EventPage() {
  const { id } = useLocalSearchParams();
  const event = events.find((event) => event.id === id);

  if (!event) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-700">Event Not Found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: 'Event Details',
          headerBackTitleVisible: false,
          headerTintColor: '#3B82F6',
        }}
      />

      <View className="gap-4 p-4">
        <Image source={{ uri: event.image }} className="aspect-video w-full rounded-xl" />

        <View className="gap-3">
          <Text className="text-3xl font-bold leading-9 text-gray-900">{event.title}</Text>

          <View className="flex-row items-center gap-2">
            <Feather name="calendar" size={16} color="#3B82F6" />
            <Text className="text-sm font-medium uppercase tracking-wide text-blue-600">
              {dayjs(event.datetime).format('dddd, MMMM D, YYYY • h:mm A')}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Feather name="map-pin" size={16} color="#6B7280" />
            <Text className="text-base text-gray-700">{event.location}</Text>
          </View>

          <Text className="mt-2 text-base leading-6 text-gray-700">{event.description}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
