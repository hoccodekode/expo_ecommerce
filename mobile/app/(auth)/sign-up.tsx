import { useSignUp } from '@clerk/clerk-expo';
import { useRouter, Stack } from 'expo-router';
import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Bước 1: Gửi thông tin đăng ký ban đầu
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    if (!emailAddress || !password || !fullName) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      await signUp.create({
        emailAddress: emailAddress.trim(),
        password,
        firstName: fullName, // Lưu tên vào hệ thống Clerk
      });

      // Gửi mã OTP về email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
      Alert.alert("Thành công", "Mã xác thực đã được gửi về email của bạn!");
    } catch (err: any) {
      Alert.alert("Lỗi", err.errors?.[0]?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác thực OTP để hoàn tất
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/');
      }
    } catch (err: any) {
      Alert.alert("Lỗi OTP", err.errors?.[0]?.message || "Mã xác thực không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.container}>
        <Text style={styles.logo}>WindFashion</Text>

        {!pendingVerification ? (
          // Giao diện Đăng ký ban đầu
          <>
            <Text style={styles.titleText}>Tạo tài khoản</Text>

            <View style={[styles.inputBox, { marginTop: 32 }]}>
              <TextInput
                placeholder="Họ và tên"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
              />
            </View>

            <View style={styles.inputBox}>
              <TextInput
                placeholder="Email"
                value={emailAddress}
                onChangeText={setEmailAddress}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputBox}>
              <TextInput
                placeholder="Mật khẩu"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={onSignUpPress}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đăng ký</Text>}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={{ color: "#555", fontWeight: "600" }}>Đã có tài khoản?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.register}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // Giao diện nhập mã OTP
          <>
            <Text style={styles.titleText}>Xác thực Email</Text>
            <Text style={styles.subText}>Vui lòng nhập mã OTP đã gửi tới {emailAddress}</Text>

            <View style={[styles.inputBox, { marginTop: 32 }]}>
              <TextInput
                placeholder="Nhập mã xác thực"
                value={code}
                onChangeText={setCode}
                style={styles.input}
                keyboardType="number-pad"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#10b981' }, loading && { opacity: 0.7 }]}
              onPress={onVerifyPress}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Xác nhận</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPendingVerification(false)} style={{ marginTop: 20 }}>
              <Text style={{ textAlign: 'center', color: '#555' }}>Quay lại</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 26, paddingTop: 100, backgroundColor: "#f4e1c9ff" },
  logo: { fontSize: 36, fontWeight: "800", alignSelf: "center", marginBottom: 20, color: "#cc7606ff" },
  titleText: { fontSize: 20, fontWeight: "600", color: '#cc7606ff', textAlign: "center" },
  subText: { fontSize: 14, color: '#555', textAlign: "center", marginTop: 8 },
  inputBox: { marginBottom: 16 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12, fontSize: 16, backgroundColor: "#fafafa" },
  button: { backgroundColor: "#cc7606ff", paddingVertical: 14, borderRadius: 15, marginTop: 20 },
  buttonText: { textAlign: "center", color: "#fff", fontSize: 17, fontWeight: "600" },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 24, gap: 6 },
  register: { color: "#cc7606ff", fontWeight: "600" }
});