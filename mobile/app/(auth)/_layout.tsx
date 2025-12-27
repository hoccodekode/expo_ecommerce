// import { Redirect, Stack } from 'expo-router'
// import { useAuth } from '@clerk/clerk-expo'

// export default function AuthRoutesLayout() {
//   const { isSignedIn } = useAuth()

//   if (isSignedIn) {
//     return <Redirect href={'/'} />
//   }


//   return <Stack />
// }
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { ActivityIndicator, View } from 'react-native';

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  // BƯỚC QUAN TRỌNG: Nếu Clerk chưa load xong, hiển thị vòng quay loading
  // thay vì cho phép app render trang Login
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0F3F4' }}>
        <ActivityIndicator size="large" color="#057893" />
      </View>
    );
  }

  // Nếu đã đăng nhập thì mới chuyển hướng
  if (isSignedIn) {
    return <Redirect href={'/'} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}