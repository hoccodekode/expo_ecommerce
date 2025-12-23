import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View, FlatList, Image, ActivityIndicator } from 'react-native'
import { SignOutButton } from '@/app/components/SignOutButton'
import { useEffect, useState } from 'react'
// 1. Định nghĩa "khuôn mẫu" cho sản phẩm (Đây là bước dán nhãn)
interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
} 

export default function Page() {
  const { user } = useUser()
 const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true) // Trạng thái đang tải

  // Tự động gọi API khi vào trang
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://expo-ecommerce-wrd1.onrender.com/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Lỗi fetch:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <SignedIn>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold">Chào {user?.emailAddresses[0].emailAddress}</Text>
          <SignOutButton />
        </View>

        <Text className="text-xl font-bold mb-4 italic">Sản phẩm mới nhất</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            numColumns={2} // Chia làm 2 cột cho giống app Shopee
            renderItem={({ item }) => (
              <View className="flex-1 m-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
                <Image 
                  source={{ uri: item.image }} 
                  className="w-full h-32 rounded-md" 
                  resizeMode="cover"
                />
                <Text className="font-bold mt-2" numberOfLines={1}>{item.name}</Text>
                <Text className="text-red-500 font-semibold">{item.price.toLocaleString()}đ</Text>
                <Text className="text-xs text-gray-500 italic">Kho: {item.stock}</Text>
              </View>
            )}
          />
        )}
      </SignedIn>
      
      <SignedOut>
        <View className="flex-1 justify-center items-center">
            <Link href="/(auth)/sign-in" className="mb-4">
            <Text className="text-blue-500 text-lg">Sign in</Text>
            </Link>
            <Link href="/(auth)/sign-up">
            <Text className="text-blue-500 text-lg">Sign up</Text>
            </Link>
        </View>
      </SignedOut>
    </View>
  )
}