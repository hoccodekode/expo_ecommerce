import express from 'express';
import { Webhook } from 'svix';
import mongoose from 'mongoose';
import User from './models/User.js'; // Đảm bảo có đuôi .js
import Product from './models/Product.js';
import cors from 'cors';
import 'dotenv/config';
const app = express();

// Thêm dòng này TRƯỚC các route
app.use(cors({
  origin: '*', // Cho phép tất cả các nguồn truy cập (Chỉ dùng khi đang code)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// 1. Route Webhook phải ở TRÊN CÙNG và dùng express.raw
app.post('/api/webhooks/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const payload = req.body.toString();
    const headers = req.headers;

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    
    // Xác thực chữ ký từ Clerk
    const evt = wh.verify(payload, headers);
    
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const eventType = evt.type;

    if (eventType === 'user.created') {
      const email = email_addresses[0].email_address;
      
      const newUser = new User({
        clerkId: id,
        email: email,
        firstName: first_name || "",
        lastName: last_name || "",
        imageUrl: image_url
      });

      await newUser.save();
      console.log('✅ Đã lưu User vào MongoDB Atlas');
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Webhook Error:', err.message);
    return res.status(400).send('Webhook verification failed');
  }
});

// 2. Sau đó mới đến các Middleware và Route khác
app.use(express.json());

// API lấy tất cả sản phẩm
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
  }
});

// API tạo sản phẩm mới (Để bạn test bằng Postman hoặc gửi dữ liệu mẫu)
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo sản phẩm", error });
  }
});
app.get('/api/health', (req, res) => {
  res.send('Hello from Express server!');
});
// Route cuối cùng để xử lý trang Admin (SPA)
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(adminDistPath, "index.html"));
});

// Kết nối Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connect Error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));