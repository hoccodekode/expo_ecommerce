import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useIsFocused } from '@react-navigation/native';

export default function CartScreen() {
  const { user } = useUser();
  const isFocused = useIsFocused();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://expo-ecommerce-wrd1.onrender.com/api/cart/${user?.id}`);
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused && user) fetchCart();
  }, [isFocused, user]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>GIỎ HÀNG</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={cart?.items || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <Image source={{ uri: item.image }} style={{ width: 80, height: 100, borderRadius: 10 }} />
              <View style={{ marginLeft: 15, flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ color: '#888' }}>Size: {item.size} | SL: {item.quantity}</Text>
                <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{item.price.toLocaleString()} đ</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text>Giỏ hàng trống</Text>}
        />
      )}
    </View>
  );
}