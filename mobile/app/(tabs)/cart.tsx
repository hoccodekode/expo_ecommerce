import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, TextInput, ScrollView } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setCartCount } from '@/app/cartCountStore';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const { user } = useUser();
  const isFocused = useIsFocused();
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [address, setAddress] = useState('');
  const [showAddressInput, setShowAddressInput] = useState(false);

  const fetchCart = async (forceRefresh = false) => {
    if (!user) return;
    setLoading(true);
    try {
      // Thêm timestamp để tránh cache
      const timestamp = forceRefresh ? `?t=${Date.now()}` : '';
      const response = await fetch(`https://expo-ecommerce-wrd1.onrender.com/api/cart/${user.id}${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log("🔍 Fetch cart - UserID:", user.id);
      console.log("📡 Response status:", response.status);
       
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("✅ Dữ liệu giỏ hàng nhận được:", data.items?.length || 0, "sản phẩm");
        console.log("📋 Chi tiết:", JSON.stringify(data.items || [], null, 2));
        
        // Đảm bảo luôn có items array
        if (!data.items || data.items.length === 0) {
          console.log("🔄 Giỏ hàng trống, set về empty");
          setCart({ items: [] });
        } else {
          setCart(data);
        }
      } else {
        console.log("⚠️ Response không phải JSON hoặc lỗi, set giỏ hàng trống");
        setCart({ items: [] });
      }
    } catch (error) {
      console.error("❌ Lỗi fetch giỏ hàng:", error);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật số lượng
  const updateQuantity = async (productId: string, size: string, newQuantity: number) => {
    if (newQuantity < 1) {
      Alert.alert("Thông báo", "Số lượng phải lớn hơn 0");
      return;
    }
    
    try {
      const response = await fetch('https://expo-ecommerce-wrd1.onrender.com/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clerkId: user?.id, 
          productId, 
          size, 
          quantity: newQuantity 
        }),
      });
      
      if (response.ok) {
        // Force refresh sau khi cập nhật
        setTimeout(() => {
          fetchCart(true);
        }, 300);
      } else {
        const errorData = await response.json();
        Alert.alert("Lỗi", errorData.message || "Không thể cập nhật số lượng");
        fetchCart(true);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật số lượng");
    }
  };

  // Hàm xóa sản phẩm
  const removeItem = async (productId: string, size: string) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa sản phẩm này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch('https://expo-ecommerce-wrd1.onrender.com/api/cart/remove', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clerkId: user?.id, productId, size }),
              });
              if (response.ok) {
                setTimeout(() => {
                  fetchCart(true);
                }, 300);
              } else {
                Alert.alert("Lỗi", "Không thể xóa sản phẩm");
              }
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa sản phẩm");
            }
          }
        }
      ]
    );
  };

  // Hàm xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa toàn bộ giỏ hàng?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              // Set giỏ hàng về empty ngay lập tức để UI phản hồi nhanh
              setCart({ items: [] });
              
              const response = await fetch(`https://expo-ecommerce-wrd1.onrender.com/api/cart/clear/${user?.id}`, {
                method: 'DELETE',
                headers: {
                  'Cache-Control': 'no-cache',
                  'Pragma': 'no-cache'
                }
              });
              
              if (response.ok) {
                const data = await response.json();
                console.log("✅ Đã xóa giỏ hàng từ server:", data);
                console.log("🗑️ Số lượng cart đã xóa:", data.deletedCount);
                
                // Đợi một chút để đảm bảo server đã xóa xong, rồi fetch lại với force refresh
                setTimeout(() => {
                  fetchCart(true); // Force refresh với timestamp
                }, 500);
                
                Alert.alert("Thành công", `Đã xóa ${data.deletedCount || 0} giỏ hàng`);
              } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("❌ Lỗi khi xóa giỏ hàng:", errorData);
                Alert.alert("Lỗi", errorData.message || "Không thể xóa giỏ hàng");
                // Fetch lại để lấy dữ liệu thực tế
                fetchCart(true);
              }
            } catch (error) {
              console.error("❌ Lỗi khi xóa giỏ hàng:", error);
              Alert.alert("Lỗi", "Không thể xóa giỏ hàng");
              // Fetch lại để lấy dữ liệu thực tế
              fetchCart(true);
            }
          }
        }
      ]
    );
  };

  // Hàm thanh toán
  const handleCheckout = async () => {
    if (!address.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập địa chỉ giao hàng");
      setShowAddressInput(true);
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
      Alert.alert("Thông báo", "Giỏ hàng đang trống");
      return;
    }

    setCheckingOut(true);
    try {
      const response = await fetch('https://expo-ecommerce-wrd1.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user?.id,
          items: cart.items,
          totalAmount: totalPrice,
          address: address.trim(),
          status: 'Chờ xử lý'
        }),
      });

      if (response.ok) {
        const orderData = await response.json();
        
        // Xóa giỏ hàng sau khi thanh toán thành công
        try {
          const clearResponse = await fetch(`https://expo-ecommerce-wrd1.onrender.com/api/cart/clear/${user?.id}`, {
            method: 'DELETE'
          });
          if (clearResponse.ok) {
            const clearData = await clearResponse.json();
            console.log("✅ Đã xóa giỏ hàng sau thanh toán:", clearData);
          }
        } catch (clearError) {
          console.error("Lỗi khi xóa giỏ hàng:", clearError);
        }

        Alert.alert(
          "Thanh toán thành công!",
          `Đơn hàng của bạn đã được tạo.\nTổng tiền: ${totalPrice.toLocaleString()} đ\n\nĐịa chỉ: ${address}`,
          [
            {
              text: "OK",
              onPress: () => {
                setAddress('');
                setShowAddressInput(false);
                setTimeout(() => {
                  fetchCart(true);
                }, 500);
              }
            }
          ]
        );
      } else {
        const errorData = await response.json();
        Alert.alert("Lỗi", errorData.message || "Không thể tạo đơn hàng");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      Alert.alert("Lỗi", "Không thể kết nối đến server. Vui lòng thử lại sau.");
    } finally {
      setCheckingOut(false);
    }
  };

  useEffect(() => {
    if (isFocused && user) fetchCart();
  }, [isFocused, user]);

  // Load selected address when returning from address screen
  useEffect(() => {
    if (isFocused) {
      loadSelectedAddress();
    }
  }, [isFocused]);

  const loadSelectedAddress = async () => {
    if (!user) return;
    try {
      const response = await fetch(`https://expo-ecommerce-wrd1.onrender.com/api/addresses/${user.id}`);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Server returned non-JSON response for addresses');
        return;
      }
      
      if (response.ok) {
        const addresses = await response.json();
        // Find default address
        const defaultAddr = addresses.find((addr: any) => addr.isDefault);
        if (defaultAddr) {
          setAddress(`${defaultAddr.name} - ${defaultAddr.phone}\n${defaultAddr.address}`);
          setShowAddressInput(true);
        }
      }
    } catch (error) {
      console.error('Error loading address:', error);
    }
  };

  // Tính tổng tiền
  const totalPrice = cart?.items?.reduce((total: number, item: any) => total + (item.price * item.quantity), 0) || 0;
  const totalItems = cart?.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0;

  // Cập nhật cart count vào store
  useEffect(() => {
    setCartCount(totalItems);
  }, [totalItems]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={styles.center} color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>GIỎ HÀNG</Text>
        {cart?.items?.length > 0 && (
          <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={18} color="#ff4444" />
            <Text style={styles.clearBtnText}>Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {cart?.items?.length > 0 && (
        <Text style={styles.itemCount}>{totalItems} sản phẩm</Text>
      )}

      <FlatList
        data={cart?.items || []}
        keyExtractor={(item, index) => `${item.productId}-${item.size}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemSub}>Size: {item.size}</Text>
              <Text style={styles.itemPrice}>{item.price.toLocaleString()} đ</Text>
              
              {/* Nút tăng/giảm số lượng */}
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityBtn}
                  onPress={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                >
                  <Ionicons name="remove" size={18} color="#000" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity 
                  style={styles.quantityBtn}
                  onPress={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                >
                  <Ionicons name="add" size={18} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.rightSection}>
              <Text style={styles.itemTotal}>
                {(item.price * item.quantity).toLocaleString()} đ
              </Text>
              <TouchableOpacity 
                style={styles.deleteBtn}
                onPress={() => removeItem(item.productId, item.size)}
              >
                <Ionicons name="trash-outline" size={22} color="#ff4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Giỏ hàng đang trống</Text>
            <Text style={styles.emptySubText}>Hãy thêm sản phẩm vào giỏ hàng của bạn</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 200 }}
      />

      {cart?.items?.length > 0 && (
        <View style={styles.footer}>
          {showAddressInput && (
            <View style={styles.addressContainer}>
              <Text style={styles.addressLabel}>Địa chỉ giao hàng:</Text>
              <TextInput
                style={styles.addressInput}
                placeholder="Nhập địa chỉ giao hàng..."
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={2}
              />
            </View>
          )}
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tổng sản phẩm:</Text>
              <Text style={styles.summaryValue}>{totalItems} sản phẩm</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>TỔNG CỘNG:</Text>
              <Text style={styles.totalAmount}>{totalPrice.toLocaleString()} đ</Text>
            </View>
          </View>

          {!showAddressInput && (
            <TouchableOpacity 
              style={styles.addressToggleBtn}
              onPress={() => router.push('/address/shipping')}
            >
              <Ionicons name="location-outline" size={18} color="#000" />
              <Text style={styles.addressToggleText}>Chọn địa chỉ giao hàng</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.checkoutBtn, checkingOut && styles.checkoutBtnDisabled]}
            onPress={handleCheckout}
            disabled={checkingOut}
          >
            {checkingOut ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="card-outline" size={20} color="#fff" />
                <Text style={styles.checkoutText}>THANH TOÁN</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    paddingHorizontal: 16 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5
  },
  title: { 
    fontSize: 28, 
    fontWeight: '900', 
    letterSpacing: 1,
    color: '#000',
    flex: 1
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444'
  },
  clearBtnText: {
    marginLeft: 4,
    color: '#ff4444',
    fontSize: 12,
    fontWeight: '600'
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15
  },
  cartItem: { 
    flexDirection: 'row', 
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  image: { 
    width: 90, 
    height: 120, 
    borderRadius: 12, 
    backgroundColor: '#f9f9f9' 
  },
  itemDetails: { 
    marginLeft: 12, 
    flex: 1,
    justifyContent: 'space-between'
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333',
    marginBottom: 4
  },
  itemSub: { 
    color: '#888', 
    fontSize: 13, 
    marginBottom: 8
  },
  itemPrice: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#666',
    marginBottom: 8
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: 100,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  quantityBtn: {
    padding: 4
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center'
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 8
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    marginBottom: 8
  },
  deleteBtn: {
    padding: 8
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 20, 
    color: '#999', 
    fontSize: 18,
    fontWeight: '600'
  },
  emptySubText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#bbb',
    fontSize: 14
  },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: '#fff', 
    padding: 16, 
    borderTopWidth: 1, 
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5
  },
  addressContainer: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    minHeight: 60,
    textAlignVertical: 'top'
  },
  summaryContainer: {
    marginBottom: 12
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666'
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  totalLabel: { 
    fontSize: 16, 
    color: '#333', 
    fontWeight: 'bold' 
  },
  totalAmount: { 
    fontSize: 24, 
    fontWeight: '900',
    color: '#000'
  },
  addressToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9'
  },
  addressToggleText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#000'
  },
  checkoutBtn: { 
    backgroundColor: '#000', 
    paddingVertical: 16, 
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  checkoutBtnDisabled: {
    opacity: 0.6
  },
  checkoutText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16,
    letterSpacing: 0.5
  }
});