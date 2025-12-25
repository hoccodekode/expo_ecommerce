import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
// app/_layout.tsx
import "../global.css"; // Thêm một dấu chấm nữa để lùi ra ngoài thư mục app
// Cấu hình lưu trữ Token
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      {/* Nếu đã đăng nhập */}
      <SignedIn>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SignedIn>

      {/* Nếu chưa đăng nhập */}
      <SignedOut>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Chào mừng bạn! Vui lòng đăng nhập để tiếp tục.</Text>
          {/* Ở đây bạn sẽ đặt component Login sau */}
        </View>
      </SignedOut>
    </ClerkProvider>
  );
}