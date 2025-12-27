import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Định nghĩa kiểu dữ liệu cho Props
interface MenuItemProps {
  title: string;
  icon: any; // Hoặc kiểu string cụ thể cho tên icon
  provider: 'Ionicons' | 'Feather';
}
export default function ProfileScreen() {
  const { user } = useUser(); // Lấy thông tin người dùng từ Clerk
  const { signOut } = useAuth(); // Hàm đăng xuất
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/sign-in'); // Chuyển về trang login sau khi đăng xuất
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <Image
          source={{ uri: user?.imageUrl || 'https://picsum.photos/200/200?user' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.fullName || 'Khách hàng'}</Text>
        <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress || 'Chưa cập nhật email'}</Text>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
      </View>

      {/* ===== STATS ===== */}
      <View style={styles.statsBox}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Đơn hàng</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Yêu thích</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Đánh giá</Text>
        </View>
      </View>

      {/* ===== MENU ===== */}
      <View style={styles.menuBox}>
        <MenuItem title="Đơn hàng của tôi" icon="package" provider="Feather" />
        <MenuItem title="Địa chỉ giao hàng" icon="location-outline" provider="Ionicons" />
        <MenuItem title="Phương thức thanh toán" icon="card-outline" provider="Ionicons" />
        <MenuItem title="Mã giảm giá" icon="ticket-outline" provider="Ionicons" />
        <MenuItem title="Cài đặt" icon="settings-outline" provider="Ionicons" />
      </View>

      {/* ===== LOGOUT ===== */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ===== COMPONENT MENU ITEM =====
function MenuItem({ title, icon, provider }: MenuItemProps) {
  const IconComponent = provider === 'Feather' ? Feather : Ionicons;
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <IconComponent name={icon} size={18} color="#333" style={styles.menuIcon} />
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#999" />
    </TouchableOpacity>
  );
}

// ================= STYLE =================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#000',
    alignItems: 'center',
    paddingVertical: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginTop: 15,
    letterSpacing: 0.5,
  },
  email: {
    fontSize: 13,
    color: '#AAA',
    marginTop: 4,
  },
  editButton: {
    marginTop: 20,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  editText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statsBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 25,
    paddingVertical: 20,
    // Shadow cho iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Shadow cho Android
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  menuBox: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 25,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#f9f9f9',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  logoutButton: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});