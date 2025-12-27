import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SignOutButton } from '@/app/components/SignOutButton';

// Dữ liệu danh mục cố định
const CATEGORIES = [
  { id: '1', name: 'Áo thun', icon: 'shirt-outline' },
  { id: '2', name: 'Áo khoác', icon: 'layers-outline' }, // Sửa chữ L thành l
  { id: '3', name: 'Quần jean', icon: 'reorder-four-outline' },
  { id: '4', name: 'Váy', icon: 'woman-outline' },
  { id: '5', name: 'Giảm giá', icon: 'flame-outline' },
];

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPrice?: number;
  image: string;
  description: string;
  stock: number;
  sold?: number;
  category: string;
  size?: string[];
}

export default function HomeScreen() {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  // Lấy dữ liệu từ API thật của bạn
  const fetchProducts = async () => {
    try {
      const API_URL = 'https://expo-ecommerce-wrd1.onrender.com/api/products';
      console.log("API URL:", API_URL);
      
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Lỗi fetch sản phẩm:", error);
      // Set products về mảng rỗng nếu có lỗi
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => router.push({
        pathname: '/category/[name]',
        params: { name: item.name }
      })}
    >
      <View style={styles.categoryIconCircle}>
        <Ionicons name={item.icon as any} size={24} color="#000" />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: Product }) => {
    // Tính % giảm giá
    const discountPercent = item.originalPrice && item.price < item.originalPrice
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : 0;

    return (
      <TouchableOpacity style={styles.productCard} activeOpacity={0.8}
        onPress={() => router.push({
          pathname: "/product/[id]",
          params: { 
            id: item._id, 
            name: item.name, 
            price: item.price,
            originalPrice: item.originalPrice,
            discountPrice: item.discountPrice,
            image: item.image, 
            description: item.description,
            stock: item.stock,
            sold: item.sold || 0,
            size: JSON.stringify(item.size || []),
          }
        })}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        
        {/* Badge giảm giá */}
        {discountPercent > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discountPercent}%</Text>
          </View>
        )}
        
        <View style={styles.productInfo}>
          <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
          
          {/* Giá */}
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
            {item.originalPrice > item.price && (
              <Text style={styles.originalPrice}>{item.originalPrice.toLocaleString()} đ</Text>
            )}
          </View>
          
          {/* Đã bán */}
          {item.sold && item.sold > 0 && (
            <Text style={styles.soldText}>Đã bán {item.sold}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4e1c9ff' }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Xin chào,</Text>
            <Text style={styles.userName}>
              {user?.firstName || user?.emailAddresses[0].emailAddress.split('@')[0]}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={22} color="#000" />
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        {/* ===== SEARCH ===== */}
        <TouchableOpacity 
          style={styles.searchBox}
          onPress={() => router.push('/(tabs)/search')}
          activeOpacity={0.7}
        >
          <Ionicons name="search-outline" size={20} color="#888" style={{ marginRight: 10 }} />
          <Text style={styles.searchPlaceholder}>Bạn đang tìm gì hôm nay?</Text>
        </TouchableOpacity>

        {/* ===== BANNER ===== */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop' }}
            style={styles.banner}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Bộ sưu tập mới</Text>
            <Text style={styles.bannerSub}>Giảm tới 50% cho thành viên</Text>
          </View>
        </View>

        {/* ===== CATEGORIES ===== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Xem tất cả</Text></TouchableOpacity>
        </View>
        <FlatList
          data={CATEGORIES}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderCategory}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        />

        {/* ===== PRODUCTS ===== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sản phẩm bán chạy</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Xem tất cả</Text></TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={renderProduct}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  welcomeText: { fontSize: 14, color: '#888' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  iconButton: { backgroundColor: '#fff', padding: 8, borderRadius: 12 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: { flex: 1, fontSize: 15 },
  searchPlaceholder: { flex: 1, fontSize: 15, color: '#888' },
  bannerContainer: { position: 'relative', marginBottom: 24 },
  banner: { width: '100%', height: 160, borderRadius: 20 },
  bannerOverlay: {
    position: 'absolute',
    left: 20,
    top: 40,
  },
  bannerTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
  bannerSub: { color: '#fff', fontSize: 14, marginTop: 4 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  seeAll: { color: '#888', fontSize: 13 },
  categoryItem: { alignItems: 'center', marginRight: 20 },
  categoryIconCircle: {
    backgroundColor: '#fff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  categoryText: { marginTop: 8, fontSize: 12, fontWeight: '500', color: '#444' },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    width: '48%',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  productImage: { width: '100%', height: 170 },
  discountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '600', color: '#333', height: 40 },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 4,
  },
  productPrice: { fontSize: 15, color: '#FF4B4B', fontWeight: 'bold' },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  soldText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});