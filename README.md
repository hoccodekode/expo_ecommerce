# 🛍️ Expo E-Commerce Platform

Hệ thống thương mại điện tử đầy đủ tính năng với Mobile App (React Native/Expo), Admin Panel (React/Vite), và Backend API (Node.js/Express).

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [Chạy dự án](#-chạy-dự-án)
- [API Documentation](#-api-documentation)
- [VNPay Integration](#-vnpay-integration)
- [Deployment](#-deployment)

## ✨ Tính năng

### Mobile App (React Native/Expo)
- 🔐 **Xác thực người dùng** với Clerk
- 🏠 **Trang chủ** với sản phẩm nổi bật và danh mục
- 🔍 **Tìm kiếm & Lọc** sản phẩm
- 🛒 **Giỏ hàng** với quản lý số lượng
- 💳 **Thanh toán** đa phương thức:
  - Tiền mặt (COD)
  - VNPay (Cổng thanh toán điện tử)
  - MoMo (Sẵn sàng tích hợp)
  - Chuyển khoản ngân hàng
- 🎫 **Mã giảm giá** với validation
- 📦 **Lịch sử đơn hàng** với trạng thái chi tiết
- 💰 **Trạng thái thanh toán**: Đã thanh toán / Chờ thanh toán / Thất bại
- ❤️ **Danh sách yêu thích**
- 👤 **Hồ sơ người dùng** với thống kê đơn hàng
- 📍 **Quản lý địa chỉ giao hàng**

### Admin Panel (React/Vite)
- 📊 **Dashboard** với thống kê tổng quan:
  - Tổng sản phẩm, đơn hàng, khách hàng
  - Doanh thu
  - Trạng thái đơn hàng
- 📦 **Quản lý sản phẩm**:
  - Thêm/Sửa/Xóa sản phẩm
  - Upload ảnh qua Cloudinary
  - Quản lý giá gốc, giá giảm, tồn kho
  - Size, màu sắc, tags
- 🛍️ **Quản lý đơn hàng**:
  - Xem chi tiết đơn hàng (modal)
  - Cập nhật trạng thái đơn hàng
  - Filter theo trạng thái thanh toán
  - Xóa đơn hàng
- 👥 **Quản lý khách hàng**:
  - Xem danh sách khách hàng
  - Chi tiết khách hàng (modal)
  - Xóa khách hàng

### Backend API (Node.js/Express)
- 🔌 RESTful API
- 🗄️ MongoDB với Mongoose
- 📤 Upload ảnh lên Cloudinary
- 💳 VNPay payment gateway integration
- 🔐 Webhook handling cho Clerk
- 🎫 Hệ thống mã giảm giá
- 📊 Order management với payment status

## 🛠️ Công nghệ sử dụng

### Mobile App
- **Framework**: React Native + Expo
- **Routing**: Expo Router (file-based routing)
- **Authentication**: Clerk
- **State Management**: Zustand
- **Icons**: Ionicons
- **HTTP Client**: Fetch API

### Admin Panel
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **File Upload**: Multer + Cloudinary
- **Payment**: VNPay API
- **Security**: CORS, dotenv

## 📁 Cấu trúc dự án

```
Expo-Ecommerce/
├── mobile/                 # React Native/Expo App
│   ├── app/               # Expo Router pages
│   │   ├── (auth)/       # Auth screens
│   │   ├── (tabs)/       # Tab navigation
│   │   ├── address/      # Address management
│   │   ├── category/     # Category pages
│   │   └── product/      # Product details
│   ├── assets/           # Images, fonts
│   └── app.json          # Expo config
│
├── admin/                 # Admin Panel (Vite + React)
│   ├── src/
│   │   ├── App.jsx       # Main admin component
│   │   ├── OrderDetailModal.jsx
│   │   └── UserDetailModal.jsx
│   └── dist/             # Build output
│
├── backend/               # Node.js Backend
│   └── src/
│       ├── models/       # Mongoose models
│       │   ├── Product.js
│       │   ├── Order.js
│       │   ├── Cart.js
│       │   └── DiscountCode.js
│       ├── config/
│       │   └── vnpay.js  # VNPay integration
│       └── server.js     # Express app
│
└── README.md
```

## 🚀 Cài đặt

### Prerequisites
- Node.js >= 18.x
- MongoDB (local hoặc MongoDB Atlas)
- Expo CLI
- Clerk account
- Cloudinary account
- VNPay merchant account (cho payment)

### 1. Clone repository

```bash
git clone <repository-url>
cd Expo-Ecommerce
```

### 2. Cài đặt dependencies

```bash
# Backend
cd backend
npm install

# Admin
cd ../admin
npm install

# Mobile
cd ../mobile
npm install
```

## ⚙️ Cấu hình

### Backend (.env)

Tạo file `backend/.env`:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/ecommerce
# hoặc MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Clerk Webhook
CLERK_WEBHOOK_SECRET=your_webhook_secret

# Server
PORT=3000
```

### Admin (.env)

Tạo file `admin/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
# Production:
# VITE_API_BASE_URL=https://your-backend-url.com
```

### Mobile (.env)

Tạo file `mobile/.env`:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
EXPO_PUBLIC_API_URL=http://localhost:3000
# hoặc IP của máy cho testing trên thiết bị thật:
# EXPO_PUBLIC_API_URL=http://192.168.1.x:3000
```

## 🏃 Chạy dự án

### Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Server chạy tại http://localhost:3000

# Terminal 2 - Admin
cd admin
npm run dev
# Admin panel tại http://localhost:5173

# Terminal 3 - Mobile
cd mobile
npx expo start
# Scan QR code với Expo Go app
```

### Production Build

```bash
# Admin
cd admin
npm run build
# Output: admin/dist/

# Mobile
cd mobile
eas build --platform android
# hoặc
eas build --platform ios
```

## 📡 API Documentation

### Base URL
- Development: `http://localhost:3000`
- Production: `https://expo-ecommerce-wrd1.onrender.com`

### Endpoints

#### Products
```
GET    /api/products              # Lấy tất cả sản phẩm
GET    /api/products/:id          # Lấy sản phẩm theo ID
POST   /api/products              # Tạo sản phẩm mới
PUT    /api/products/:id          # Cập nhật sản phẩm
DELETE /api/products/:id          # Xóa sản phẩm
```

#### Orders
```
GET    /api/orders                # Lấy tất cả đơn hàng
GET    /api/orders/:clerkId       # Lấy đơn hàng theo user
POST   /api/orders                # Tạo đơn hàng mới
PUT    /api/orders/:id            # Cập nhật đơn hàng
DELETE /api/orders/:id            # Xóa đơn hàng
```

#### Cart
```
GET    /api/cart/:clerkId         # Lấy giỏ hàng
POST   /api/cart                  # Thêm vào giỏ hàng
PUT    /api/cart/:clerkId         # Cập nhật giỏ hàng
DELETE /api/cart/clear/:clerkId   # Xóa giỏ hàng
```

#### Payment (VNPay)
```
POST   /api/payment/vnpay/create  # Tạo payment URL
GET    /api/payment/vnpay/return  # Callback từ VNPay
```

#### Upload
```
POST   /api/upload                # Upload ảnh lên Cloudinary
```

#### Users
```
GET    /api/users                 # Lấy danh sách users
DELETE /api/users/:id             # Xóa user
```

#### Discount Codes
```
GET    /api/discount-codes        # Lấy tất cả mã giảm giá
POST   /api/discount-codes/validate  # Validate mã giảm giá
```

## 💳 VNPay Integration

### Cấu hình VNPay

File `backend/src/config/vnpay.js`:

```javascript
export const vnpayConfig = {
  vnp_TmnCode: 'YOUR_TMN_CODE',
  vnp_HashSecret: 'YOUR_HASH_SECRET',
  vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_ReturnUrl: 'https://your-backend.com/api/payment/vnpay/return'
};
```

### Payment Flow

1. User chọn VNPay làm phương thức thanh toán
2. App gọi `POST /api/payment/vnpay/create` với:
   - `orderId`: ID đơn hàng
   - `amount`: Số tiền
   - `orderInfo`: Thông tin đơn hàng (ASCII only)
3. Backend tạo VNPay payment URL với signature
4. App mở URL trong browser
5. User thanh toán trên VNPay
6. VNPay redirect về `vnp_ReturnUrl`
7. Backend verify signature và cập nhật order status
8. Hiển thị trang "Thanh toán thành công"

### Lưu ý quan trọng

- ✅ Tất cả parameters phải được URL encode khi tạo signature
- ✅ Khoảng trắng phải thay bằng `+` (không phải `%20`)
- ✅ `orderInfo` chỉ dùng ký tự ASCII
- ✅ Timezone phải là UTC+7 (Asia/Ho_Chi_Minh)
- ✅ Signature dùng HMAC-SHA512

## 🌐 Deployment

### Backend (Render)

1. Push code lên GitHub
2. Tạo Web Service trên Render
3. Cấu hình:
   - Build Command: `npm install --prefix backend && npm install --prefix admin && npm run build --prefix admin`
   - Start Command: `node backend/src/server.js`
4. Thêm Environment Variables
5. Deploy

### Admin Panel

Admin được serve từ backend tại `/` sau khi build.

### Mobile App

```bash
# Build với EAS
eas build --platform android
eas build --platform ios

# Submit lên stores
eas submit --platform android
eas submit --platform ios
```

## 📝 Order Schema

```javascript
{
  clerkId: String,           // User ID từ Clerk
  items: Array,              // Danh sách sản phẩm
  totalAmount: Number,       // Tổng tiền
  status: String,            // Chờ xử lý, Đang giao, Hoàn thành, Đã hủy
  address: String,           // Địa chỉ giao hàng
  paymentMethod: String,     // cash, vnpay, momo, bank
  paymentStatus: String,     // pending, paid, failed
  vnpayTransactionId: String,// VNPay transaction ID
  discountCode: String,      // Mã giảm giá đã dùng
  discountAmount: Number,    // Số tiền giảm
  createdAt: Date
}
```

## 🎨 Features Highlights

### Payment Status Display
- Mobile Profile: Badge màu cho trạng thái thanh toán
- Admin Panel: Filter theo payment status + badge

### Order Details Modal
- Click vào mã đơn hàng để xem chi tiết
- Hiển thị: Thông tin đơn, địa chỉ, thanh toán, sản phẩm

### User Management
- Click "Chi tiết" để xem thông tin khách hàng
- Xóa khách hàng trực tiếp từ modal hoặc table

## 🐛 Troubleshooting

### VNPay "Sai chữ ký"
- Kiểm tra `orderInfo` chỉ dùng ASCII
- Verify timezone là UTC+7
- Đảm bảo URL encoding đúng chuẩn

### Mobile không kết nối được Backend
- Kiểm tra `EXPO_PUBLIC_API_URL` trong `.env`
- Dùng IP thay vì `localhost` khi test trên thiết bị
- Đảm bảo backend đang chạy

### Admin không load được sản phẩm
- Kiểm tra `VITE_API_BASE_URL` trong `admin/.env`
- Verify CORS settings trong backend

## 📄 License

MIT

## 👨‍💻 Author

Developed with ❤️ by HocCode

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Happy Coding! 🚀**
