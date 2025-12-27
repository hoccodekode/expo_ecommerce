// app/cartStore.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

// Giả lập một mảng giỏ hàng trong bộ nhớ (trong thực tế nên dùng Context hoặc Redux)
export let cartItems: CartItem[] = [];

export const addToCart = (item: CartItem) => {
  const existingItem = cartItems.find(i => i.id === item.id && i.size === item.size);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push(item);
  }
};