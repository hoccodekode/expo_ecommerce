// app/cartCountStore.ts
// Store đơn giản để theo dõi số lượng cart và wishlist

let cartCount = 0;
let wishlistCount = 0;
const listeners: Set<() => void> = new Set();

export const getCartCount = () => cartCount;
export const getWishlistCount = () => wishlistCount;

export const setCartCount = (count: number) => {
    cartCount = count;
    notifyListeners();
};

export const setWishlistCount = (count: number) => {
    wishlistCount = count;
    notifyListeners();
};

export const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

const notifyListeners = () => {
    listeners.forEach(listener => listener());
};
