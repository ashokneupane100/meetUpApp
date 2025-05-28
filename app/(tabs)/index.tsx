import { Stack } from 'expo-router';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import EventListItem from '@/components/EventListItem';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('datetime', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        setError(error.message);
      } else {
        setEvents(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-600">Loading events...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-center text-lg text-red-500">Error loading events: {error}</Text>
        <Text className="mt-4 text-center text-blue-500 underline" onPress={fetchEvents}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
    <Stack.Screen options={{ title: "Events Tracking By Ashok Neupane" }} />
      <FlatList
        data={events}
        renderItem={({ item }) => <EventListItem event={item} />}
        keyExtractor={(item) => item.id.toString()}
        className="bg-white"
        contentContainerStyle={{
          padding: 16,
          gap: 12,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={fetchEvents}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-center text-lg text-gray-500">No events found</Text>
          </View>
        }
      />
    </View>
  );
}
