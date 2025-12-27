// app/wishlistStore.ts
export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

// Mảng lưu trữ sản phẩm yêu thích trong bộ nhớ
export let wishlistItems: WishlistItem[] = [];

// Thêm sản phẩm vào danh sách yêu thích
export const addToWishlist = (item: WishlistItem) => {
  const existingItem = wishlistItems.find(i => i._id === item._id);
  if (!existingItem) {
    wishlistItems.push(item);
    return true;
  }
  return false;
};

// Xóa sản phẩm khỏi danh sách yêu thích
export const removeFromWishlist = (id: string) => {
  wishlistItems = wishlistItems.filter(item => item._id !== id);
};

// Kiểm tra sản phẩm có trong danh sách yêu thích không
export const isInWishlist = (id: string) => {
  return wishlistItems.some(item => item._id === id);
};

// Lấy tất cả sản phẩm yêu thích
export const getWishlistItems = () => {
  return wishlistItems;
};

// Xóa tất cả sản phẩm yêu thích
export const clearWishlist = () => {
  wishlistItems = [];
};
