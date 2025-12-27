import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2; // Tính toán chiều rộng card cho 2 cột

// ================= MOCK DATA =================
const INITIAL_FAVORITES = [
  {
    id: 'f1',
    name: 'Áo hoodie Wind Signature',
    price: 399000,
    image: 'https://picsum.photos/400/500?21',
  },
  {
    id: 'f2',
    name: 'Váy dự tiệc Minimalist',
    price: 599000,
    image: 'https://picsum.photos/400/500?22',
  },
  {
    id: 'f3',
    name: 'Quần jean Vintage Blue',
    price: 349000,
    image: 'https://picsum.photos/400/500?23',
  },
];

export default function WishlistScreen() {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }: { item: typeof INITIAL_FAVORITES[0] }) => (
    <View style={styles.card}>
      {/* Image Section */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <TouchableOpacity 
          style={styles.heartButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons name="heart" size={20} color="#FF4B4B" />
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>
          {item.name.toUpperCase()}
        </Text>
        <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>

        <TouchableOpacity style={styles.addCartButton} activeOpacity={0.8}>
          <Feather name="shopping-bag" size={14} color="#FFF" style={{marginRight: 6}} />
          <Text style={styles.addCartText}>MUA NGAY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>YÊU THÍCH</Text>
          <Text style={styles.subTitle}>{favorites.length} sản phẩm đã lưu</Text>
        </View>
        <TouchableOpacity style={styles.clearAll}>
          <Text style={styles.clearAllText}>Xóa tất cả</Text>
        </TouchableOpacity>
      </View>

      {/* ===== LIST ===== */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={80} color="#EEE" />
            <Text style={styles.empty}>Danh sách yêu thích trống</Text>
            <TouchableOpacity style={styles.goShop}>
              <Text style={styles.goShopText}>KHÁM PHÁ NGAY</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ================= STYLE =================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 13,
    color: '#AAA',
    fontWeight: '500',
    marginTop: 2,
  },
  clearAll: {
    paddingBottom: 4,
  },
  clearAllText: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'underline',
  },
  card: {
    backgroundColor: '#FFF',
    width: COLUMN_WIDTH,
    marginBottom: 20,
    // Không dùng shadow/elevation để tạo cảm giác "Flat Design" sang trọng
  },
  imageWrap: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F9F9F9',
  },
  image: {
    width: '100%',
    height: 240, // Tăng chiều cao để hợp với ảnh thời trang
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  name: {
    fontSize: 11,
    fontWeight: '800',
    color: '#333',
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    marginVertical: 6,
  },
  addCartButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCartText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  empty: {
    marginTop: 20,
    fontSize: 16,
    color: '#AAA',
    fontWeight: '500',
  },
  goShop: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: '#000',
    borderRadius: 30,
  },
  goShopText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
  },
});