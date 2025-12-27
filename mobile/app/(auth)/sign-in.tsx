import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter, Stack } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Logic đăng nhập bằng Clerk
  const onSignInPress = async () => {
    if (!isLoaded) return;
    if (!emailAddress || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }

    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Thông báo", "Tài khoản cần thêm bước xác thực.");
      }
    } catch (err: any) {
      const errorMessage = err.errors?.[0]?.message || "Đăng nhập thất bại.";
      Alert.alert("Lỗi", errorMessage);
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
        {/* Logo */}
        <Text style={styles.logo}>WindDental</Text>

        {/* Title */}
        <Text style={styles.titleText}>Đăng nhập</Text>

        {/* Input Email */}
        <View style={[styles.inputBox, { marginTop: 32 }]}>
          <TextInput
            placeholder="Email"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* Input Password */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
        </View>

        {/* Quên mật khẩu */}
        <TouchableOpacity onPress={() => Alert.alert("Thông báo", "Tính năng này đang cập nhật")}>
          <Text style={styles.forgot}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        {/* Nút Đăng nhập */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={onSignInPress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Đăng nhập</Text>
            )}
          </TouchableOpacity>

          {/* Face ID icon giả lập */}
          <TouchableOpacity style={styles.faceIdBox}>
            <Image 
              source={require("../../assets/images/face-id.png")} 
              style={styles.faceIdImage} 
            />
          </TouchableOpacity>
        </View>

        {/* Đăng ký */}
        <View style={styles.footerRow}>
          <Text style={{ color: "#555", fontWeight: "600" }}>Không có tài khoản?</Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text style={styles.register}>Tạo ngay</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Social Login */}
        <View style={styles.socialSection}>
          <Text style={styles.socialText}>Hoặc đăng nhập bằng</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity><Image source={require("../../assets/images/google.png")} style={styles.icon} /></TouchableOpacity>
            <TouchableOpacity><Image source={require("../../assets/images/apple.png")} style={styles.icon} /></TouchableOpacity>
            <TouchableOpacity><Image source={require("../../assets/images/facebook.png")} style={styles.icon} /></TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 26, paddingTop: 100, backgroundColor: "#E0F3F4" },
  logo: { fontSize: 36, fontWeight: "800", alignSelf: "center", marginBottom: 40, color: "#47e608ff" },
  titleText: { fontSize: 20, fontWeight: "600", color: '#331559', textAlign: "center" },
  inputBox: { marginBottom: 16 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12, fontSize: 16, backgroundColor: "#fafafa" },
  forgot: { alignSelf: "flex-start", marginVertical: 10, fontSize: 14, color: "#7d7f87ff", fontWeight: "600" },
  button: { backgroundColor: "#057893", paddingVertical: 14, borderRadius: 15, flex: 1 },
  buttonText: { textAlign: "center", color: "#fff", fontSize: 17, fontWeight: "600" },
  faceIdBox: { width: '20%', alignItems: 'center', justifyContent: 'center' },
  faceIdImage: { width: 48, height: 48, marginLeft: 10 },
  footer: { flexDirection: "row", alignItems: 'center', marginTop: 12 },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 24, gap: 6 },
  register: { color: "#057893", fontWeight: "600" },
  socialSection: { marginTop: 32 },
  socialText: { color: "#555", textAlign: "center", fontWeight: "600" },
  socialIcons: { flexDirection: "row", justifyContent: "center", marginTop: 12, gap: 20 },
  icon: { width: 40, height: 40 }
});