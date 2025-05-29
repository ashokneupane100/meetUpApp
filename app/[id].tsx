import { useLocalSearchParams, Stack } from 'expo-router';
import { Text, View, Image, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { supabase } from '@/lib/supabase';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';

export default function EventPage() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRSVPed, setIsRSVPed] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const { user } = useAuth();

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

      const { data: attendanceData } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", user.id)
        .eq("event_id", id)
        .single();
      setAttendance(attendanceData);

    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const joinEvent = async () => {
    setIsRSVPed(!isRSVPed);
    
    const { data, error } = await supabase.from('attendance').insert({ user_id: user.id, event_id: event.id });
    console.log(data);
    console.log(error);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Stack.Screen
          options={{
            title: 'Loading...',
            headerBackTitleVisible: false,
            headerTintColor: '#3B82F6',
            headerStyle: { backgroundColor: '#F8FAFC' },
          }}
        />
        <View className="items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 text-lg text-gray-600 font-medium">Loading event...</Text>
        </View>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View className="flex-1 items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-6">
        <Stack.Screen
          options={{
            title: 'Error',
            headerBackTitleVisible: false,
            headerTintColor: '#DC2626',
            headerStyle: { backgroundColor: '#FEF2F2' },
          }}
        />
        <View className="items-center bg-white rounded-2xl p-8 shadow-lg">
          <Feather name="alert-circle" size={48} color="#DC2626" />
          <Text className="text-xl font-bold text-red-600 mt-4 text-center">
            {error || 'Event Not Found'}
          </Text>
          <Pressable 
            className="mt-6 bg-red-500 px-6 py-3 rounded-xl shadow-md"
            onPress={fetchEvent}
          >
            <Text className="text-white font-semibold text-lg">Tap to retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: event.title,
          headerBackTitleVisible: false,
          headerTintColor: '#3B82F6',
          headerStyle: { backgroundColor: '#F8FAFC' },
          headerTitleStyle: { fontSize: 18, fontWeight: '600' },
        }}
      />
      
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero Image */}
        <View className="relative">
          <Image 
            source={{ uri: event.image || 'https://picsum.photos/400/300?random=1' }} 
            className="w-full h-80"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/20" />
          
          {/* Floating Action Buttons */}
          <View className="absolute top-4 right-4 flex-row gap-3">
            <Pressable className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
              <Feather name="share" size={20} color="#374151" />
            </Pressable>
            <Pressable className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
              <FontAwesome name="heart-o" size={20} color="#374151" />
            </Pressable>
          </View>
        </View>

        {/* Content Card */}
        <View className="bg-white -mt-6 mx-4 rounded-t-3xl shadow-xl">
          <View className="p-6">
            {/* Event Title */}
            <Text className="text-3xl font-bold text-gray-900 leading-tight mb-4">
              {event.title}
            </Text>

            {/* Date & Time Card */}
            <View className="bg-blue-50 rounded-2xl p-4 mb-4 border-l-4 border-blue-500">
              <View className="flex-row items-center">
                <View className="bg-blue-500 rounded-full p-2 mr-3">
                  <Feather name="calendar" size={18} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                    {dayjs(event.datetime).format('dddd, MMMM D, YYYY')}
                  </Text>
                  <Text className="text-lg font-bold text-blue-800">
                    {dayjs(event.datetime).format('h:mm A')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Location Card */}
            <View className="bg-gray-50 rounded-2xl p-4 mb-6 border-l-4 border-gray-400">
              <View className="flex-row items-center">
                <View className="bg-gray-500 rounded-full p-2 mr-3">
                  <Feather name="map-pin" size={18} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Location
                  </Text>
                  <Text className="text-lg font-semibold text-gray-800">
                    {event.location}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">About This Event</Text>
              <Text className="text-base leading-7 text-gray-700">
                {event.description}
              </Text>
            </View>

            {/* Event Stats */}
            <View className="flex-row justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 mb-6">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-indigo-600">
                  {event.attendees_count || 42}
                </Text>
                <Text className="text-sm text-gray-600 font-medium">Attending</Text>
              </View>
              <View className="w-px bg-gray-300" />
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-purple-600">FREE</Text>
                <Text className="text-sm text-gray-600 font-medium">Entry</Text>
              </View>
              <View className="w-px bg-gray-300" />
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-green-600">2h</Text>
                <Text className="text-sm text-gray-600 font-medium">Duration</Text>
              </View>
            </View>

            {/* Organizer Info */}
            <View className="bg-white border border-gray-200 rounded-2xl p-4">
              <Text className="text-lg font-bold text-gray-900 mb-2">Event Organizer</Text>
              <View className="flex-row items-center">
                <View className="bg-indigo-500 rounded-full w-12 h-12 items-center justify-center mr-3">
                  <Text className="text-white font-bold text-lg">AN</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">Ashok Neupane</Text>
                  <Text className="text-sm text-gray-600">Event Coordinator</Text>
                </View>
                <Pressable className="bg-gray-100 rounded-full p-2">
                  <Feather name="message-circle" size={20} color="#6B7280" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom RSVP Section */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
        <View className="flex-row items-center justify-between p-6 pb-8">
          <View>
            <Text className="text-2xl font-bold text-green-600">FREE</Text>
          </View>

          {attendance ? (
            <Text className="text-green-500 font-bold">You are going...</Text>
          ) : (
            <Pressable 
              className={`flex-row items-center px-8 py-4 rounded-2xl shadow-lg ${
                isRSVPed 
                  ? 'bg-green-500' 
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}
              onPress={joinEvent}
            >
              <Feather 
                name={isRSVPed ? "check-circle" : "plus-circle"} 
                size={20} 
                color="white" 
                style={{ marginRight: 8 }}
              />
              <Text className="text-lg font-bold text-white">
                {isRSVPed ? 'RSVP Confirmed!' : 'Join and RSVP'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}