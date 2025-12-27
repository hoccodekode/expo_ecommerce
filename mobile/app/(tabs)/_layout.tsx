// import { Stack } from 'expo-router/stack'

// export default function Layout() {
//   return <Stack />
// }
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',      // Màu khi tab đang được chọn (Đen)
        tabBarInactiveTintColor: '#9CA3AF', // Màu khi tab không được chọn (Xám)
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          backgroundColor: '#FFF',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          textTransform: 'uppercase', // Chữ in hoa cho phong cách thời trang
        },
        headerShown: false, // Ẩn header mặc định của hệ thống
      }}
    >
      {/* 1. Trang chủ */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 2. Yêu thích */}
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Yêu thích',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 3. Giỏ hàng */}
      <Tabs.Screen
  name="cart"
  options={{
    title: 'GIỎ HÀNG',
    tabBarIcon: ({ color, focused }) => (
      <View style={{ width: 24, height: 24 }}>
        <Ionicons 
          name={focused ? 'cart' : 'cart-outline'} 
          size={24} 
          color={color} 
        />
        {/* Phần Badge số lượng - Cần căn chỉnh absolute chính xác */}
        <View style={{
          position: 'absolute',
          right: -6,
          top: -3,
          backgroundColor: 'black',
          borderRadius: 8,
          width: 16,
          height: 16,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1
        }}>
          <Text style={{ 
            color: 'white', 
            fontSize: 10, 
            fontWeight: 'bold' 
          }}>
            2
          </Text>
        </View>
      </View>
    ),
  }}
/>

      {/* 4. Hồ sơ */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}