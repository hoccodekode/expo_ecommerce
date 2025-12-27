import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Order {
  _id: string;
  items: any[];
  totalAmount: number;
  status: string;
  createdAt: string;
  address: string;
}

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const response = await fetch(`https://expo-ecommerce-wrd1.onrender.com/api/orders`);
      if (response.ok) {
        const allOrders = await response.json();
        // Filter orders for current user
        const userOrders = allOrders.filter((order: Order) => order.clerkId === user.id);
        setOrders(userOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  // Calculate order statistics
  const pendingOrders = orders.filter(o => o.status === 'Chờ xử lý').length;
  const shippingOrders = orders.filter(o => o.status === 'Đang giao').length;
  const completedOrders = orders.filter(o => o.status === 'Hoàn thành').length;
  const totalOrders = orders.length;

  // Get recent orders (last 5)
  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Chờ xử lý': return '#FFA500';
      case 'Đang giao': return '#2196F3';
      case 'Hoàn thành': return '#4CAF50';
      case 'Đã hủy': return '#F44336';
      default: return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Chờ xử lý': return 'time-outline';
      case 'Đang giao': return 'bicycle-outline';
      case 'Hoàn thành': return 'checkmark-circle-outline';
      case 'Đã hủy': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: user?.imageUrl || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.fullName || 'Khách hàng'}</Text>
          <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>

        {/* Order Status Summary */}
        <View style={styles.statusContainer}>
          <Text style={styles.sectionTitle}>Đơn hàng của tôi</Text>
          <View style={styles.statusGrid}>
            <TouchableOpacity style={styles.statusCard}>
              <View style={[styles.statusIconBg, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="time-outline" size={24} color="#FFA500" />
              </View>
              <Text style={styles.statusNumber}>{pendingOrders}</Text>
              <Text style={styles.statusLabel}>Chờ xử lý</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statusCard}>
              <View style={[styles.statusIconBg, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="bicycle-outline" size={24} color="#2196F3" />
              </View>
              <Text style={styles.statusNumber}>{shippingOrders}</Text>
              <Text style={styles.statusLabel}>Đang giao</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statusCard}>
              <View style={[styles.statusIconBg, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.statusNumber}>{completedOrders}</Text>
              <Text style={styles.statusLabel}>Hoàn thành</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.ordersContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lịch sử mua hàng</Text>
            {totalOrders > 5 && (
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
          ) : recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <TouchableOpacity key={order._id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderIdRow}>
                    <Ionicons name="receipt-outline" size={16} color="#666" />
                    <Text style={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                    <Ionicons name={getStatusIcon(order.status)} size={14} color={getStatusColor(order.status)} />
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderInfo}>
                  <View style={styles.orderRow}>
                    <Text style={styles.orderLabel}>Số lượng:</Text>
                    <Text style={styles.orderValue}>{order.items.length} sản phẩm</Text>
                  </View>
                  <View style={styles.orderRow}>
                    <Text style={styles.orderLabel}>Tổng tiền:</Text>
                    <Text style={styles.orderPrice}>{order.totalAmount.toLocaleString()} đ</Text>
                  </View>
                  <View style={styles.orderRow}>
                    <Text style={styles.orderLabel}>Ngày đặt:</Text>
                    <Text style={styles.orderValue}>
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyOrders}>
              <Ionicons name="cart-outline" size={60} color="#DDD" />
              <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
              <Text style={styles.emptySubText}>Hãy mua sắm ngay!</Text>
            </View>
          )}
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/address/shipping')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="location-outline" size={22} color="#333" />
              <Text style={styles.menuText}>Địa chỉ giao hàng</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="card-outline" size={22} color="#333" />
              <Text style={styles.menuText}>Phương thức thanh toán</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="ticket-outline" size={22} color="#333" />
              <Text style={styles.menuText}>Mã giảm giá</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="settings-outline" size={22} color="#333" />
              <Text style={styles.menuText}>Cài đặt</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#000',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  email: {
    fontSize: 13,
    color: '#AAA',
    marginTop: 4,
  },
  statusContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statusCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
  },
  statusIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  ordersContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: '#F9F9F9',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderId: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  orderInfo: {
    gap: 6,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 13,
    color: '#666',
  },
  orderValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  orderPrice: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
  },
  emptyOrders: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 13,
    color: '#BBB',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: 'bold',
  },
});