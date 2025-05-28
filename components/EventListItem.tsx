import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View, Image, Pressable } from 'react-native';
import dayjs from 'dayjs';
import { Link } from 'expo-router';

export default function EventListItem({ event }) {
  return (
    <Link href={`/${event.id}`} asChild>
      <Pressable className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        {/* Event Header */}
        <View className="flex-row items-start gap-4">
          {/* Event Details */}
          <View className="flex-1">
            {/* Date & Time */}
            <View className="mb-3">
              <Text className="text-sm font-medium uppercase tracking-wide text-blue-600">
                {dayjs(event.datetime).format('dddd, MMMM YYYY ')}
                {dayjs(event.datetime).format('h:mm A')}
              </Text>
            </View>

            {/* Event Title */}
            <Text className="mb-2 text-xl font-bold leading-6 text-gray-900" numberOfLines={3}>
              {event?.title}
            </Text>

            {/* Location */}
            <View className="mb-3 flex-row items-center">
              <Feather name="map-pin" size={14} color="#6B7280" />
              <Text className="ml-1 font-medium text-gray-600">{event.location}</Text>
            </View>
          </View>

          {/* Event Image */}
          <View className="h-24 w-24">
            <Image
              source={{
                uri: event.image || 'https://via.placeholder.com/150',
              }}
              className="h-full w-full rounded-lg"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Divider */}
        <View className="my-4 h-px bg-gray-200" />

        {/* Footer Actions */}
        <View className="flex-row items-center justify-between">
          {/* Attendees */}
          <View className="flex-row items-center">
            <View className="mr-2 h-2 w-2 rounded-full bg-green-500" />
            <Text className="font-medium text-gray-700">
              {event.attendees_count || 0} going
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row items-center gap-4">
            <Pressable className="rounded-full p-2 hover:bg-gray-100">
              <Feather name="share" size={20} color="#6B7280" />
            </Pressable>
            <Pressable className="rounded-full p-2 hover:bg-gray-100">
              <FontAwesome name="bookmark-o" size={20} color="#6B7280" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}