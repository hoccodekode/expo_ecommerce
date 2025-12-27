import 'dotenv/config'; // Luôn để dòng này trên cùng
import express from 'express';
import { Webhook } from 'svix';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import { upload } from './config/cloudinary.js';
// Import Models
import User from './models/User.js';
import Product from './models/Product.js';

const app = express();

// --- KHAI BÁO ĐƯỜNG DẪN (Để fix lỗi ReferenceError) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Khai báo adminDistPath để sử dụng cho trang Admin
const adminDistPath = path.join(__dirname, "../../admin/dist");

// --- MIDDLEWARE ---
// Thêm CORS TRƯỚC các route
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// API Health Check
app.get('/api/health', (req, res) => {
  res.send('Hello from Express server!');
});

// --- ROUTES ---

// 1. Route Webhook Clerk (Dùng express.raw để xác thực Svix)
app.post('/api/webhooks/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const payload = req.body.toString();
    const headers = req.headers;
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    
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

// 2. Middleware JSON (Đặt sau Webhook)
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

// API tạo sản phẩm mới
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo sản phẩm", error });
  }
});
// Route Upload ảnh
app.post('/api/upload', upload.single('image'), (req, res) => {
  console.log("--- Bắt đầu Upload ---");
  console.log("File nhận được:", req.file); // Nếu dòng này hiện undefined => Lỗi do Multer/Admin gửi sai tên

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không nhận được file ảnh" });
    }
    console.log("Upload Cloudinary thành công, URL:", req.file.path);
    res.status(200).json({ imageUrl: req.file.path });
  } catch (error) {
    console.error("Lỗi tại Route Upload:", error);
    res.status(500).json({ error: error.message });
  }
});

// API lấy tất cả khách hàng (Sắp xếp người mới nhất lên đầu)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách khách hàng", error });
  }
});

// --- PHỤC VỤ GIAO DIỆN ADMIN ---

// Phục vụ các file tĩnh (css, js, images) từ thư mục dist của admin
app.use(express.static(adminDistPath));

// Route cuối cùng để xử lý trang Admin (SPA)
// Thay "/{*any}" bằng "*" để đúng chuẩn Express catch-all
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(adminDistPath, "index.html"));
});

// --- KẾT NỐI DATABASE & START SERVER ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connect Error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));