import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'reset'>('email');

  // Bước 1: Gửi mã reset về email
  const onSendResetCode = async () => {
    if (!isLoaded) return;
    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    setLoading(true);
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim(),
      });
      
      Alert.alert(
        'Thành công', 
        'Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.',
        [{ text: 'OK', onPress: () => setStep('reset') }]
      );
    } catch (err: any) {
      const errorMessage = err.errors?.[0]?.message || 'Không thể gửi mã xác thực';
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác thực mã và đặt lại mật khẩu
  const onResetPassword = async () => {
    if (!isLoaded) return;
    if (!code.trim() || !newPassword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password: newPassword,
      });

      if (result.status === 'complete') {
        Alert.alert(
          'Thành công',
          'Mật khẩu đã được đặt lại thành công!',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/sign-in') }]
        );
      }
    } catch (err: any) {
      const errorMessage = err.errors?.[0]?.message || 'Không thể đặt lại mật khẩu';
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.container}>
        {/* Header */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#cc7606ff" />
        </TouchableOpacity>

        <Text style={styles.logo}>WindFashion</Text>
        
        <Text style={styles.title}>
          {step === 'email' ? 'Quên mật khẩu?' : 'Đặt lại mật khẩu'}
        </Text>
        
        <Text style={styles.subtitle}>
          {step === 'email' 
            ? 'Nhập email của bạn để nhận mã xác thực'
            : 'Nhập mã xác thực và mật khẩu mới'}
        </Text>

        {step === 'email' ? (
          // Bước 1: Nhập email
          <>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={onSendResetCode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Gửi mã xác thực</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          // Bước 2: Nhập mã và mật khẩu mới
          <>
            <View style={styles.inputBox}>
              <Ionicons name="key-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                placeholder="Mã xác thực"
                value={code}
                onChangeText={setCode}
                style={styles.input}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChangeText={setNewPassword}
                style={styles.input}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={onResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => setStep('email')}
            >
              <Text style={styles.resendText}>Gửi lại mã xác thực</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Back to login */}
        <TouchableOpacity
          style={styles.backToLogin}
          onPress={() => router.back()}
        >
          <Text style={styles.backToLoginText}>Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
    paddingTop: 60,
    backgroundColor: '#f4e1c9ff',
  },
  backButton: {
    marginBottom: 20,
  },
  logo: {
    fontSize: 36,
    fontWeight: '800',
    alignSelf: 'center',
    marginBottom: 40,
    color: '#cc7606ff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#cc7606ff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#cc7606ff',
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  resendButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  resendText: {
    color: '#cc7606ff',
    fontSize: 14,
    fontWeight: '600',
  },
  backToLogin: {
    marginTop: 32,
    alignSelf: 'center',
  },
  backToLoginText: {
    color: '#7d7f87ff',
    fontSize: 14,
    fontWeight: '600',
  },
});
