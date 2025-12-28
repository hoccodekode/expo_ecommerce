import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentResultScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { success, orderId, amount, message } = params;

  const isSuccess = success === 'true';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, isSuccess ? styles.successBg : styles.errorBg]}>
          <Ionicons 
            name={isSuccess ? 'checkmark-circle' : 'close-circle'} 
            size={80} 
            color={isSuccess ? '#4CAF50' : '#F44336'} 
          />
        </View>

        <Text style={styles.title}>
          {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
        </Text>

        {isSuccess ? (
          <>
            <Text style={styles.message}>
              Đơn hàng của bạn đã được thanh toán thành công
            </Text>
            {orderId && (
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Mã đơn hàng:</Text>
                <Text style={styles.infoValue}>#{String(orderId).slice(-8).toUpperCase()}</Text>
              </View>
            )}
            {amount && (
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Số tiền:</Text>
                <Text style={styles.infoValue}>{Number(amount).toLocaleString()} đ</Text>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.errorMessage}>
            {message ? decodeURIComponent(String(message)) : 'Đã có lỗi xảy ra trong quá trình thanh toán'}
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.replace('/(tabs)/profile')}
          >
            <Ionicons name="receipt-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Xem đơn hàng</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.replace('/(tabs)')}
          >
            <Ionicons name="home-outline" size={20} color="#000" />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successBg: {
    backgroundColor: '#E8F5E9',
  },
  errorBg: {
    backgroundColor: '#FFEBEE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  errorMessage: {
    fontSize: 14,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 8,
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: '#000',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#000',
  },
});
