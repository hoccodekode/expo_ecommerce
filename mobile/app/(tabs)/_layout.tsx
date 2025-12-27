// import { Stack } from 'expo-router/stack'

// export default function Layout() {
//   return <Stack />
// }
import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { getCartCount, getWishlistCount, subscribe } from '@/app/cartCountStore';

export default function TabLayout() {
  const [cartCount, setCartCount] = useState(getCartCount());
  const [wishlistCount, setWishlistCount] = useState(getWishlistCount());

  useEffect(() => {
    // Subscribe to count changes
    const unsubscribe = subscribe(() => {
      setCartCount(getCartCount());
      setWishlistCount(getWishlistCount());
    });
    
    return unsubscribe;
  }, []);
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

      {/* 2. Tìm kiếm - Ẩn khỏi tab bar */}
      <Tabs.Screen
        name="search"
        options={{
          href: null, // Ẩn tab này khỏi tab bar
          title: 'Tìm kiếm',
        }}
      />

      {/* 3. Yêu thích */}
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Yêu thích',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 24, height: 24 }}>
              <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
              {wishlistCount > 0 && (
                <View style={{
                  position: 'absolute',
                  right: -6,
                  top: -3,
                  backgroundColor: '#FF4B4B',
                  borderRadius: 8,
                  minWidth: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 4,
                  zIndex: 1
                }}>
                  <Text style={{ 
                    color: 'white', 
                    fontSize: 10, 
                    fontWeight: 'bold' 
                  }}>
                    {wishlistCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      {/* 4. Giỏ hàng */}
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
        {cartCount > 0 && (
          <View style={{
            position: 'absolute',
            right: -6,
            top: -3,
            backgroundColor: 'black',
            borderRadius: 8,
            minWidth: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 4,
            zIndex: 1
          }}>
            <Text style={{ 
              color: 'white', 
              fontSize: 10, 
              fontWeight: 'bold' 
            }}>
              {cartCount}
            </Text>
          </View>
        )}
      </View>
    ),
  }}
/>

      {/* 5. Hồ sơ */}
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