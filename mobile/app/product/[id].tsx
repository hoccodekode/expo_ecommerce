import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { addToWishlist, removeFromWishlist, isInWishlist } from '@/app/wishlistStore';

export default function ProductDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Kiểm tra sản phẩm có trong wishlist không khi component mount
  useEffect(() => {
    setIsFavorite(isInWishlist(params.id as string));
  }, [params.id]);

  const updateQuantity = (type: 'plus' | 'minus') => {
    if (type === 'plus') {
      setQuantity(prev => prev + 1);
    } else {
      if (quantity > 1) setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      Alert.alert("Thông báo", "Vui lòng chọn Size!");
      return;
    }

    if (!user?.id) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch(`https://expo-ecommerce-wrd1.onrender.com/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          productId: params.id,
          name: params.name,
          price: Number(params.price),
          image: params.image,
          size: selectedSize,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        Alert.alert("Thành công", `Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      } else {
        Alert.alert("Lỗi", "Không thể thêm vào giỏ hàng");
      }
    } catch (error: any) {
      Alert.alert("Lỗi kết nối", error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = () => {
    const product = {
      _id: params.id as string,
      name: params.name as string,
      price: Number(params.price),
      image: params.image as string,
      description: params.description as string,
    };

    if (isFavorite) {
      removeFromWishlist(params.id as string);
      setIsFavorite(false);
      Alert.alert("Đã xóa", "Đã xóa khỏi danh sách yêu thích");
    } else {
      addToWishlist(product);
      setIsFavorite(true);
      Alert.alert("Đã thêm", "Đã thêm vào danh sách yêu thích ❤️");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* 1. NÚT QUAY LẠI Ở GÓC TRÁI */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      {/* NÚT YÊU THÍCH Ở GÓC PHẢI */}
      <TouchableOpacity 
        style={styles.wishlistButton} 
        onPress={handleToggleWishlist}
      >
        <Ionicons 
          name={isFavorite ? "heart" : "heart-outline"} 
          size={26} 
          color={isFavorite ? "#FF4B4B" : "black"} 
        />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: params.image as string }} style={{ width: '100%', height: 450 }} />
        
        <View style={styles.infoContainer}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{params.name}</Text>
          
          {/* Giá và giảm giá */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>{Number(params.price).toLocaleString()} đ</Text>
              {params.originalPrice && Number(params.originalPrice) > Number(params.price) && (
                <>
                  <Text style={styles.originalPriceDetail}>
                    {Number(params.originalPrice).toLocaleString()} đ
                  </Text>
                  <View style={styles.discountBadgeDetail}>
                    <Text style={styles.discountPercentText}>
                      -{Math.round(((Number(params.originalPrice) - Number(params.price)) / Number(params.originalPrice)) * 100)}%
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Thông tin kho và đã bán */}
          <View style={styles.inventorySection}>
            <View style={styles.inventoryItem}>
              <Ionicons name="cube-outline" size={18} color="#666" />
              <Text style={styles.inventoryText}>Kho: {params.stock || 0}</Text>
            </View>
            <View style={styles.inventoryItem}>
              <Ionicons name="cart-outline" size={18} color="#666" />
              <Text style={styles.inventoryText}>Đã bán: {params.sold || 0}</Text>
            </View>
          </View>
          
          
          <Text style={styles.label}>CHỌN SIZE:</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
            {(() => {
              try {
                const availableSizes = params.size ? JSON.parse(params.size as string) : [];
                
                if (availableSizes.length === 0) {
                  return (
                    <Text style={{ color: '#999', fontSize: 14 }}>
                      Sản phẩm này chưa có size
                    </Text>
                  );
                }
                
                return availableSizes.map((size: string) => (
                  <TouchableOpacity 
                    key={size} 
                    onPress={() => setSelectedSize(size)}
                    style={[styles.sizeBox, selectedSize === size && styles.activeSize]}
                  >
                    <Text style={{ color: selectedSize === size ? '#fff' : '#000', fontWeight: 'bold' }}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ));
              } catch (error) {
                return (
                  <Text style={{ color: '#999', fontSize: 14 }}>
                    Không thể tải thông tin size
                  </Text>
                );
              }
            })()}
          </View>

          <Text style={styles.label}>SỐ LƯỢNG:</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => updateQuantity('minus')} style={styles.qtyBtn}>
              <Ionicons name="remove" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity onPress={() => updateQuantity('plus')} style={styles.qtyBtn}>
              <Ionicons name="add" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>MÔ TẢ:</Text>
          <Text style={styles.description}>
            {params.description || "Chất liệu cao cấp, thoáng mát, phù hợp cho mọi hoạt động hàng ngày."}
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.btnBuy} onPress={handleAddToCart} disabled={isAdding}>
        {isAdding ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>THÊM VÀO GIỎ</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 2. STYLE CHO NÚT QUAY LẠI
  backButton: {
    position: 'absolute',
    top: 50, // Điều chỉnh tùy theo SafeArea của từng máy
    left: 20,
    zIndex: 10, // Để nút luôn nằm trên ảnh
    backgroundColor: 'rgba(255,255,255,0.8)', // Nền trắng mờ để nổi bật trên ảnh
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  // STYLE CHO NÚT YÊU THÍCH
  wishlistButton: {
    position: 'absolute',
    top: 50,
    right: 20, // Đặt ở góc phải
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  infoContainer: { 
    padding: 20, 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    marginTop: -30 
  },
  priceSection: {
    marginVertical: 15,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF4B4B',
  },
  originalPriceDetail: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountBadgeDetail: {
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountPercentText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  inventorySection: {
    flexDirection: 'row',
    gap: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 10,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inventoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  label: { fontWeight: 'bold', marginTop: 25, fontSize: 13, color: '#888' },
  sizeBox: { width: 50, height: 50, borderColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderWidth: 1 },
  activeSize: { backgroundColor: '#000', borderColor: '#000' },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#f9f9f9',
    width: 130,
    justifyContent: 'space-between',
    borderRadius: 15,
    padding: 5
  },
  qtyBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  qtyText: { fontSize: 18, fontWeight: 'bold', width: 30, textAlign: 'center' },
  description: { color: '#666', lineHeight: 22, marginTop: 10, marginBottom: 50 },
  btnBuy: { backgroundColor: '#000', margin: 20, padding: 18, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});