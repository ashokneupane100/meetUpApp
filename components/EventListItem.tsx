import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View, Image, Pressable } from "react-native";




export default function EventListItem({event}) {


  return (
    <Pressable className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
      
      {/* Event Header */}
      <View className="flex-row items-start gap-4">
        
        {/* Event Details */}
        <View className="flex-1">
          {/* Date & Time */}
          <View className="mb-3">
            <Text className="text-sm font-medium text-blue-600 uppercase tracking-wide">
             {event.datetime}
            </Text>
          </View>
          
          {/* Event Title */}
          <Text 
            className="text-xl font-bold text-gray-900 leading-6 mb-2" 
            numberOfLines={3}
          >
            {event?.title}
          </Text>
          
          {/* Location */}
          <View className="flex-row items-center mb-3">
            <Feather name="map-pin" size={14} color="#6B7280" />
            <Text className="text-gray-600 ml-1 font-medium">{event.location}</Text>
          </View>
        </View>
        
        {/* Event Image */}
        <View className="w-24 h-24">
          <Image
            source={{ 
              uri:event.image
            }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-200 my-4" />
      
      {/* Footer Actions */}
      <View className="flex-row items-center justify-between">
        {/* Attendees */}
        <View className="flex-row items-center">
          <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          <Text className="text-gray-700 font-medium">16 going</Text>
        </View>
        
        {/* Action Buttons */}
        <View className="flex-row items-center gap-4">
          <Pressable className="p-2 rounded-full hover:bg-gray-100">
            <Feather name="share" size={20} color="#6B7280" />
          </Pressable>
          <Pressable className="p-2 rounded-full hover:bg-gray-100">
            <FontAwesome name="bookmark-o" size={20} color="#6B7280" />
          </Pressable>
        </View>
      </View>
      
    </Pressable>
  );
}

// EventListItem.defaultProps = {
//   event: {
//     title: "Event Title",
//     datetime: "Today at 7:00 PM",
//     location: "123 Main St, Anytown, USA",
//     image: "https://via.placeholder.com/150",
//   },
// };