import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
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
  image: string;
  description: string;
  stock: number;
}

export default function HomeScreen() {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
const router = useRouter();
  // Lấy dữ liệu từ API thật của bạn
  const fetchProducts = async () => {
    try {
      const response = await fetch('https://expo-ecommerce-wrd1.onrender.com/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Lỗi fetch sản phẩm:", error);
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
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryIconCircle}>
        <Ionicons name={item.icon as any} size={24} color="#000" />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard} activeOpacity={0.8}
    // THÊM DÒNG NÀY: Điều hướng và truyền dữ liệu sang trang chi tiết
    onPress={() => router.push({
      pathname: "/product/[id]",
      params: { 
        id: item._id, 
        name: item.name, 
        price: item.price, 
        image: item.image, 
        description: item.description 
      }
    })}
  >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="cart-outline" size={16} color="#fff" />
          <Text style={styles.addButtonText}> Thêm</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#888" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Bạn đang tìm gì hôm nay?"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

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
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '600', color: '#333', height: 40 },
  productPrice: { fontSize: 15, color: '#000', fontWeight: 'bold', marginVertical: 6 },
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