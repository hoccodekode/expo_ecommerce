import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export default function ShippingAddressScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    if (!user) return;
    try {
      const response = await fetch(`https://expo-ecommerce-wrd1.onrender.com/api/addresses/${user.id}`);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Server returned non-JSON response:', response.status);
        console.error('Content-Type:', contentType);
        setAddresses([]);
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      } else {
        console.error('Error loading addresses:', response.status);
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      setAddresses([]);
    }
  };



  const openAddModal = () => {
    setEditingAddress(null);
    setName('');
    setPhone('');
    setAddress('');
    setModalVisible(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setName(addr.name);
    setPhone(addr.phone);
    setAddress(addr.address);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!user) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
      return;
    }

    try {
      if (editingAddress) {
        // Update existing
        const response = await fetch(`https://expo-ecommerce-wrd1.onrender.com/api/addresses/${editingAddress.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            isDefault: editingAddress.isDefault
          }),
        });

        if (response.ok) {
          loadAddresses();
        } else {
          Alert.alert('Lỗi', 'Không thể cập nhật địa chỉ');
        }
      } else {
        // Add new
        const isFirstAddress = addresses.length === 0;
        const response = await fetch('https://expo-ecommerce-wrd1.onrender.com/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clerkId: user.id,
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            isDefault: isFirstAddress
          }),
        });

        if (response.ok) {
          loadAddresses();
        } else {
          Alert.alert('Lỗi', 'Không thể thêm địa chỉ');
        }
      }

      setModalVisible(false);
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Lỗi', 'Không thể lưu địa chỉ');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa địa chỉ này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`https://expo-ecommerce-wrd1.onrender.com/api/addresses/${id}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                loadAddresses();
              } else {
                Alert.alert('Lỗi', 'Không thể xóa địa chỉ');
              }
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Lỗi', 'Không thể xóa địa chỉ');
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch(`https://expo-ecommerce-wrd1.onrender.com/api/addresses/${id}/set-default`, {
        method: 'PUT',
      });

      if (response.ok) {
        loadAddresses();
      } else {
        Alert.alert('Lỗi', 'Không thể đặt địa chỉ mặc định');
      }
    } catch (error) {
      console.error('Error setting default:', error);
      Alert.alert('Lỗi', 'Không thể đặt địa chỉ mặc định');
    }
  };

  const handleSelectAddress = (addr: Address) => {
    // Return to cart with selected address via router state
    router.back();
    // Note: You may want to use a global state management solution
    // or pass the address via router params for better data flow
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <TouchableOpacity
      style={[styles.addressCard, item.isDefault && styles.defaultCard]}
      onPress={() => handleSelectAddress(item)}
    >
      {item.isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultText}>Mặc định</Text>
        </View>
      )}

      <View style={styles.addressHeader}>
        <View style={styles.nameRow}>
          <Ionicons name="person-outline" size={18} color="#333" />
          <Text style={styles.addressName}>{item.name}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconBtn}>
            <Ionicons name="pencil-outline" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconBtn}>
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{item.phone}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{item.address}</Text>
      </View>

      {!item.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultBtn}
          onPress={() => handleSetDefault(item.id)}
        >
          <Text style={styles.setDefaultText}>Đặt làm mặc định</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
        
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Địa chỉ giao hàng</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Address List */}
      <FlatList
        data={addresses}
        keyExtractor={item => item.id}
        renderItem={renderAddress}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={80} color="#DDD" />
            <Text style={styles.emptyText}>Chưa có địa chỉ giao hàng</Text>
            <Text style={styles.emptySubText}>Thêm địa chỉ để đặt hàng nhanh hơn</Text>
          </View>
        }
      />

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Thêm địa chỉ mới</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={28} color="#000" />
                  </TouchableOpacity>
                </View>

                <View style={styles.form}>
                  <Text style={styles.label}>Họ tên</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập họ tên người nhận"
                    value={name}
                    onChangeText={setName}
                  />

                  <Text style={styles.label}>Số điện thoại</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập số điện thoại"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />

                  <Text style={styles.label}>Địa chỉ</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Nhập địa chỉ chi tiết"
                    value={address}
                    onChangeText={setAddress}
                    multiline
                    numberOfLines={3}
                  />

                  <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Lưu địa chỉ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backBtn: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  placeholder: {
    width: 38,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  addressCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#EEE',
  },
  defaultCard: {
    borderColor: '#4CAF50',
  },
  defaultBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    padding: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  setDefaultBtn: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  setDefaultText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#BBB',
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#F9F9F9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
