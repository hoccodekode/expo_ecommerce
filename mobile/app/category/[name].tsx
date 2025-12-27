import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';

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

export default function CategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryName = params.name as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0 && categoryName) {
      filterProductsByCategory();
    }
  }, [products, categoryName]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://expo-ecommerce-wrd1.onrender.com/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProductsByCategory = () => {
    // Lọc sản phẩm theo trường category trong database
    const filtered = products.filter(product => {
      // So sánh trực tiếp với trường category
      return product.category === categoryName;
    });
    
    setFilteredProducts(filtered);
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

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{categoryName}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* CONTENT */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : filteredProducts.length > 0 ? (
        <View style={styles.content}>
          <Text style={styles.resultCount}>
            {filteredProducts.length} sản phẩm
          </Text>
          <FlatList
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
        <View style={styles.centerContainer}>
          <Ionicons name="shirt-outline" size={80} color="#EEE" />
          <Text style={styles.emptyTitle}>Chưa có sản phẩm</Text>
          <Text style={styles.emptyText}>
            Danh mục này hiện chưa có sản phẩm nào
          </Text>
          <TouchableOpacity 
            style={styles.backHomeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backHomeText}>Quay lại trang chủ</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 38, // Same width as back button for centering
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 15,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: 20,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  backHomeButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: '#000',
    borderRadius: 30,
  },
  backHomeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
