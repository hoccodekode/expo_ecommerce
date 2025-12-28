# 🛍️ Expo E-Commerce Platform

Hệ thống thương mại điện tử đầy đủ tính năng với Mobile App (React Native/Expo), Admin Panel (React/Vite), và Backend API (Node.js/Express).

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Demo & Screenshots](#-demo--screenshots)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [Chạy dự án](#-chạy-dự-án)
- [API Documentation](#-api-documentation)
- [VNPay Integration](#-vnpay-integration)
- [Admin Login](#-admin-login)
- [Deployment](#-deployment)

## ✨ Tính năng

### 📱 Mobile App (React Native/Expo)
- 🔐 **Xác thực người dùng** với Clerk
- 🏠 **Trang chủ** với sản phẩm nổi bật và danh mục
- 🔍 **Tìm kiếm & Lọc** sản phẩm theo tên, danh mục
- 📦 **Chi tiết sản phẩm** với:
  - Giá gốc, giá sale, % giảm giá
  - Số lượng đã bán, tồn kho
  - Size, màu sắc
  - Đánh giá sao
- 🛒 **Giỏ hàng** với:
  - Quản lý số lượng
  - Chọn size
  - Tính tổng tiền tự động
- 💳 **Thanh toán** đa phương thức:
  - 💵 Tiền mặt (COD)
  - 💳 VNPay (Cổng thanh toán điện tử)
  - 📱 MoMo (Sẵn sàng tích hợp)
  - 🏦 Chuyển khoản ngân hàng
- 🎫 **Mã giảm giá** với validation
- 📦 **Lịch sử đơn hàng** với:
  - Trạng thái đơn hàng (Chờ xử lý, Đang giao, Hoàn thành, Đã hủy)
  - Trạng thái thanh toán (Đã thanh toán, Chờ thanh toán, Thất bại)
  - Badge màu sắc trực quan
- ❤️ **Danh sách yêu thích** với Zustand state management
- 👤 **Hồ sơ người dùng** với:
  - Thông tin cá nhân
  - Thống kê đơn hàng
  - Lịch sử mua hàng
- 📍 **Quản lý địa chỉ giao hàng**

### 💼 Admin Panel (React/Vite)
- 🔐 **Authentication System**:
  - Login page với validation
  - Session persistence (localStorage)
  - Logout functionality
  - Default credentials: `admin@gmail.com` / `123456`

- 📊 **Dashboard** với:
  - 4 stat cards (Sản phẩm, Đơn hàng, Khách hàng, Doanh thu)
  - 📊 **Bar Chart**: Thống kê đơn hàng theo trạng thái
  - 🥧 **Pie Chart**: Trạng thái thanh toán
  - 📈 **Line Chart**: Đơn hàng theo ngày (7 ngày gần nhất)
  - Đơn hàng gần đây
  - Order status summary
  - Sản phẩm nổi bật

- 📦 **Quản lý sản phẩm**:
  - Thêm/Sửa/Xóa sản phẩm
  - Upload ảnh qua Cloudinary
  - Quản lý giá gốc, giá giảm, tồn kho
  - Size, màu sắc, tags
  - Số lượng đã bán
  - Trạng thái active/inactive

- 🛍️ **Quản lý đơn hàng**:
  - Xem chi tiết đơn hàng (modal popup)
  - Hiển thị: Thông tin khách, địa chỉ, sản phẩm, thanh toán
  - Cập nhật trạng thái đơn hàng
  - Filter theo trạng thái thanh toán (All, Paid, Pending, Failed)
  - Xóa đơn hàng
  - Badge màu cho payment status

- 👥 **Quản lý khách hàng**:
  - Xem danh sách khách hàng
  - Chi tiết khách hàng (modal popup)
  - Hiển thị: Avatar, email, ngày tham gia
  - Xóa khách hàng (từ modal hoặc table)

### 🔧 Backend API (Node.js/Express)
- 🔌 RESTful API architecture
- 🗄️ MongoDB với Mongoose ODM
- 📤 Upload ảnh lên Cloudinary
- 💳 VNPay payment gateway integration
- 🔐 Webhook handling cho Clerk
- 🎫 Hệ thống mã giảm giá
- 📊 Order management với payment status
- ⏰ **Cron job** tự động ping health check mỗi 14 phút (prevent Render sleep)
- 🏥 Health check endpoint

## 🎨 Demo & Screenshots

### Mobile App
- Trang chủ với sản phẩm nổi bật
- Chi tiết sản phẩm với giá sale
- Giỏ hàng và checkout
- VNPay payment flow
- Profile với order history
  <img width="871" height="1884" alt="image" src="https://github.com/user-attachments/assets/eb58b480-c47e-4a04-8cae-c02531de1829" />
  <img width="871" height="1884" alt="image" src="https://github.com/user-attachments/assets/0ebf3589-4af0-401a-b99d-9f8c395f5527" />
  <img width="871" height="1884" alt="image" src="https://github.com/user-attachments/assets/330b9b6a-288a-42d4-ab4f-5d0fc6c070f8" />
  <img width="871" height="1884" alt="image" src="https://github.com/user-attachments/assets/94735050-4f70-4370-843a-8459e214c470" />
  <img width="871" height="1884" alt="image" src="https://github.com/user-attachments/assets/a9bbd630-4f9c-4847-abd0-edf59172cbee" />
  <img width="871" height="1884" alt="image" src="https://github.com/user-attachments/assets/04c48fe5-1e41-4951-8efc-e3235b0f03e1" />
  <img width="871" height="1884" alt="image" src="https://github.com/user-attachments/assets/7ec1682c-1600-4e87-9843-989ce0ecd06c" />
  <img width="871" height="1884" alt="image" src="https://github.com/user-attachments/assets/d45a803d-e794-46d1-a2ff-d5c6633c67a8" />
  <img width="871" height="1884" alt="image" src="https://github.com/user-attachments/assets/7c1cd5a3-48e4-4435-b771-3920c64314d3" />
  <img width="871" height="1884" alt="image" src="https://github.com/user-attachments/assets/d0a355bf-0b81-4d03-884b-a095b730fe6d" />
  <img width="871" height="1884" alt="image" src="https://github.com/user-attachments/assets/ac476f92-f509-483e-9297-efecaf304930" />









### Admin Panel
- Login page
- Dashboard với 3 biểu đồ thống kê
- Quản lý sản phẩm
- Order detail modal
- User detail modal
  <img width="1705" height="863" alt="image" src="https://github.com/user-attachments/assets/56f4ed9d-46ae-4871-8b4a-e002f5911725" />
  <img width="1917" height="962" alt="image" src="https://github.com/user-attachments/assets/902b0513-6248-4681-9012-6d40b57d1740" />
  <img width="1916" height="951" alt="image" src="https://github.com/user-attachments/assets/689439b0-0c2d-4ddd-ba83-162a383a3ddf" />
  <img width="1918" height="938" alt="image" src="https://github.com/user-attachments/assets/8af9c908-48e6-421f-8d5e-5b364b6b7356" />
  <img width="1913" height="570" alt="image" src="https://github.com/user-attachments/assets/05d5c2d1-3b4e-4a26-a753-f991cadde836" />





## 🛠️ Công nghệ sử dụng

### Mobile App
- **Framework**: React Native + Expo SDK 52
- **Routing**: Expo Router (file-based routing)
- **Authentication**: Clerk
- **State Management**: Zustand
- **Icons**: Ionicons
- **HTTP Client**: Fetch API
- **Deep Linking**: Expo Linking

### Admin Panel
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **File Upload**: Multer + Cloudinary
- **Payment**: VNPay API
- **Cron Jobs**: node-cron
- **Security**: CORS, dotenv

## 📁 Cấu trúc dự án

```
Expo-Ecommerce/
├── mobile/                 # React Native/Expo App
│   ├── app/               # Expo Router pages
│   │   ├── (auth)/       # Auth screens (sign-in, sign-up)
│   │   ├── (tabs)/       # Tab navigation (home, search, cart, profile)
│   │   ├── address/      # Address management
│   │   ├── category/     # Category pages
│   │   ├── product/      # Product details
│   │   └── payment-result.tsx
│   ├── assets/           # Images, fonts
│   └── app.json          # Expo config
│
├── admin/                 # Admin Panel (Vite + React)
│   ├── src/
│   │   ├── App.jsx       # Main admin component with login
│   │   ├── OrderDetailModal.jsx
│   │   └── UserDetailModal.jsx
│   └── dist/             # Build output
│
├── backend/               # Node.js Backend
│   ├── src/
│   │   ├── models/       # Mongoose models
│   │   │   ├── Product.js
│   │   │   ├── Order.js
│   │   │   ├── Cart.js
│   │   │   ├── User.js
│   │   │   ├── Address.js
│   │   │   └── DiscountCode.js
│   │   ├── config/
│   │   │   ├── cloudinary.js
│   │   │   └── vnpay.js  # VNPay integration
│   │   └── server.js     # Express app
│   └── KEEP_ALIVE.md     # Cron job documentation
│
└── README.md
```

## 🚀 Cài đặt

### Prerequisites
- Node.js >= 18.x
- MongoDB (local hoặc MongoDB Atlas)
- Expo CLI: `npm install -g expo-cli`
- Clerk account (https://clerk.com)
- Cloudinary account (https://cloudinary.com)
- VNPay merchant account (cho payment)

### 1. Clone repository

```bash
git clone https://github.com/hoccodekode/expo_ecommerce.git
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

# VNPay (Optional - for payment)
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret

# Render (for deployment)
RENDER_EXTERNAL_URL=https://your-app.onrender.com

# Server
PORT=3000
```

### Admin (.env)

Tạo file `admin/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
# Production:
# VITE_API_BASE_URL=https://expo-ecommerce-wrd1.onrender.com
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
# Cron job tự động ping health check mỗi 14 phút

# Terminal 2 - Admin
cd admin
npm run dev
# Admin panel tại http://localhost:5173
# Login: admin@gmail.com / 123456

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
POST   /api/webhooks/clerk        # Clerk webhook
```

#### Discount Codes
```
GET    /api/discount-codes        # Lấy tất cả mã giảm giá
POST   /api/discount-codes/validate  # Validate mã giảm giá
```

#### Health Check
```
GET    /api/health                # Health check endpoint
Response: { status: 'OK', timestamp: '...', uptime: 12345 }
```

## 💳 VNPay Integration

### Cấu hình VNPay

File `backend/src/config/vnpay.js`:

```javascript
export const vnpayConfig = {
  vnp_TmnCode: 'X53UBDF2',
  vnp_HashSecret: 'MBAGHBDGM6JFK0QCJQH0R55GAK9JKOOX',
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

## 🔐 Admin Login

### Default Credentials
```
Email: admin@gmail.com
Password: 123456
```

### Features
- ✅ Login page với gradient background
- ✅ Session persistence với localStorage
- ✅ Logout button trong sidebar
- ✅ Form validation
- ✅ Error handling

### Security
- Credentials được hardcode trong `App.jsx`
- Session lưu trong localStorage
- Tự động redirect về login khi chưa authenticate

## 🌐 Deployment

### Backend (Render)

1. Push code lên GitHub
2. Tạo Web Service trên Render
3. Cấu hình:
   - **Build Command**: `npm install --prefix backend && npm install --prefix admin && npm run build --prefix admin`
   - **Start Command**: `node backend/src/server.js`
4. Thêm Environment Variables (xem phần Cấu hình)
5. Deploy

**Render Keep-Alive:**
- Backend có cron job tự động ping `/api/health` mỗi 14 phút
- Ngăn Render free tier sleep sau 15 phút
- Xem `backend/KEEP_ALIVE.md` để biết thêm chi tiết

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
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    size: String,
    image: String
  }],
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

### Dashboard Charts (Admin)
- **Bar Chart**: Thống kê đơn hàng theo trạng thái (Chờ xử lý, Đang giao, Hoàn thành, Đã hủy)
- **Pie Chart**: Phân bổ trạng thái thanh toán (Paid, Pending, Failed)
- **Line Chart**: Xu hướng đơn hàng 7 ngày gần nhất

### Payment Status Display
- **Mobile Profile**: Badge màu cho trạng thái thanh toán
- **Admin Panel**: Filter theo payment status + badge màu

### Order Details Modal
- Click vào mã đơn hàng để xem chi tiết
- Hiển thị: Thông tin đơn, địa chỉ, thanh toán, danh sách sản phẩm
- Responsive design

### User Management
- Click "Chi tiết" để xem thông tin khách hàng
- Modal hiển thị: Avatar, email, ngày tham gia
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
- Check network tab trong DevTools

### Render Sleep Issue
- Kiểm tra logs để xem cron job hoạt động
- Verify `RENDER_EXTERNAL_URL` environment variable
- Test health endpoint: `curl https://your-app.onrender.com/api/health`

## 📊 Tech Stack Summary

| Component | Technologies |
|-----------|-------------|
| **Mobile** | React Native, Expo, Clerk, Zustand, Expo Router |
| **Admin** | React, Vite, Tailwind CSS, Recharts, Lucide Icons |
| **Backend** | Node.js, Express, MongoDB, Mongoose, Cloudinary |
| **Payment** | VNPay API |
| **Deployment** | Render (Backend + Admin), EAS (Mobile) |
| **Automation** | node-cron (Health checks) |

## 🔄 Workflow

1. **User browses products** → Mobile App
2. **Add to cart** → Zustand state + Backend API
3. **Checkout** → Create order + VNPay payment
4. **Payment success** → Update order status
5. **Admin manages** → Dashboard, Orders, Products, Users
6. **Analytics** → Charts show trends and statistics

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Developed with ❤️ by **HocCodeKoDe**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🌟 Show your support

Give a ⭐️ if this project helped you!

---

**Happy Coding! 🚀**

**Live Demo**: [https://expo-ecommerce-wrd1.onrender.com](https://expo-ecommerce-wrd1.onrender.com)

**GitHub**: [https://github.com/hoccodekode/expo_ecommerce](https://github.com/hoccodekode/expo_ecommerce)
