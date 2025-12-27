import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';

export default function ProductDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

const handleAddToCart = async () => {
  if (!selectedSize) {
    Alert.alert("Thông báo", "Vui lòng chọn Size!");
    return;
  }

  setIsAdding(true);
  try {
    const response = await fetch(`http://localhost:3000/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerkId: user?.id,
        productId: params.id,
        name: params.name,
        price: Number(params.price),
        image: params.image,
        size: selectedSize,
        quantity: 1
      }),
    });

    // KIỂM TRA PHẢN HỒI TRƯỚC KHI PARSE
    const contentType = response.headers.get("content-type");
    if (response.ok && contentType && contentType.includes("application/json")) {
      Alert.alert("Thành công", "Đã thêm vào giỏ hàng!");
    } else {
      // Nếu không phải JSON, nghĩa là Server đang trả về lỗi HTML
      throw new Error("Server đang bảo trì hoặc bị khóa (Render Suspended)");
    }
  } catch (error: any) {
    Alert.alert("Lỗi kết nối", error.message);
  } finally {
    setIsAdding(false);
  }
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView>
        <Image source={{ uri: params.image as string }} style={{ width: '100%', height: 400 }} />
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{params.name}</Text>
          <Text style={{ fontSize: 20, color: 'red', marginVertical: 10 }}>{Number(params.price).toLocaleString()} đ</Text>
          
          <Text style={{ fontWeight: 'bold', marginTop: 10 }}>CHỌN SIZE:</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            {['S', 'M', 'L', 'XL'].map(size => (
              <TouchableOpacity 
                key={size} 
                onPress={() => setSelectedSize(size)}
                style={[styles.sizeBox, selectedSize === size && styles.activeSize]}
              >
                <Text style={{ color: selectedSize === size ? '#fff' : '#000' }}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.btnBuy} onPress={handleAddToCart}>
        {isAdding ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: 'bold' }}>THÊM VÀO GIỎ</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sizeBox: { width: 50, height: 50, borderColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1 },
  activeSize: { backgroundColor: '#000' },
  btnBuy: { backgroundColor: '#000', margin: 20, padding: 18, borderRadius: 15, alignItems: 'center' }
});