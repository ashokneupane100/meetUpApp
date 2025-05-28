import { useLocalSearchParams, Stack } from 'expo-router';
import { Text, View, Image, ScrollView, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { supabase } from '@/lib/supabase';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export default function EventPage() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        setError(error.message);
      } else {
        setEvent(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Stack.Screen
          options={{
            title: 'Loading...',
            headerBackTitleVisible: false,
            headerTintColor: '#3B82F6',
          }}
        />
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-600">Loading event...</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Stack.Screen
          options={{
            title: 'Error',
            headerBackTitleVisible: false,
            headerTintColor: '#3B82F6',
          }}
        />
        <Text className="text-lg text-red-500">
          {error || 'Event Not Found'}
        </Text>
        <Text 
          className="mt-4 text-blue-500 underline"
          onPress={fetchEvent}
        >
          Tap to retry
        </Text>
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
        <Image 
          source={{ uri: event.image || 'https://via.placeholder.com/400x200' }} 
          className="aspect-video w-full rounded-xl" 
        />

        <View className="gap-3">
          <Text className="text-3xl font-bold leading-9 text-gray-900">
            {event.title}
          </Text>

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

          <Text className="mt-2 text-base leading-6 text-gray-700">
            {event.description}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}