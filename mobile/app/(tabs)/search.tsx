import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Áo thun',
    'Quần jean',
    'Váy',
  ]);

  // Lấy tất cả sản phẩm khi component mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Tìm kiếm khi searchQuery thay đổi
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts([]);
    } else {
      performSearch(searchQuery);
    }
  }, [searchQuery]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://expo-ecommerce-wrd1.onrender.com/api/products');
      if (response.ok) {
        const data = await response.json();
        setAllProducts(data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase().trim();
    const results = allProducts.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description?.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredProducts(results);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '' && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 4)]);
    }
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredProducts([]);
    Keyboard.dismiss();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: '/product/[id]',
          params: {
            id: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            description: item.description,
          },
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text numberOfLines={2} style={styles.productName}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
        {item.stock > 0 ? (
          <Text style={styles.stockText}>Còn hàng</Text>
        ) : (
          <Text style={styles.outOfStockText}>Hết hàng</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => handleRecentSearchPress(item)}
    >
      <Ionicons name="time-outline" size={18} color="#888" />
      <Text style={styles.recentText}>{item}</Text>
      <Ionicons name="arrow-forward-outline" size={16} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>TÌM KIẾM</Text>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={22} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* CONTENT */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : searchQuery.trim() === '' ? (
        // Hiển thị lịch sử tìm kiếm khi chưa tìm
        <View style={styles.recentContainer}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Tìm kiếm gần đây</Text>
            {recentSearches.length > 0 && (
              <TouchableOpacity onPress={clearRecentSearches}>
                <Text style={styles.clearAllText}>Xóa tất cả</Text>
              </TouchableOpacity>
            )}
          </View>
          {recentSearches.length > 0 ? (
            <FlatList
              key="recent-searches-list"
              data={recentSearches}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRecentSearch}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyRecent}>
              <Ionicons name="search-outline" size={60} color="#EEE" />
              <Text style={styles.emptyText}>Chưa có lịch sử tìm kiếm</Text>
            </View>
          )}
        </View>
      ) : filteredProducts.length > 0 ? (
        // Hiển thị kết quả tìm kiếm
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsCount}>
            Tìm thấy {filteredProducts.length} sản phẩm
          </Text>
          <FlatList
            key="products-grid-list"
            data={filteredProducts}
            keyExtractor={item => item._id}
            renderItem={renderProduct}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      ) : (
        // Không tìm thấy kết quả
        <View style={styles.centerContainer}>
          <Ionicons name="sad-outline" size={80} color="#EEE" />
          <Text style={styles.noResultsTitle}>Không tìm thấy sản phẩm</Text>
          <Text style={styles.noResultsText}>
            Thử tìm kiếm với từ khóa khác
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  clearButton: {
    padding: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  clearAllText: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'underline',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  recentText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
  },
  emptyRecent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 15,
    color: '#AAA',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 15,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: 100,
  },
  productCard: {
    backgroundColor: '#FFF',
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
  productImage: {
    width: '100%',
    height: 170,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    height: 40,
  },
  productPrice: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    marginVertical: 6,
  },
  stockText: {
    fontSize: 11,
    color: '#22C55E',
    fontWeight: '600',
  },
  outOfStockText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
});
