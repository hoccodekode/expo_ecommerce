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
import Cart from './models/Cart.js';
import Order from './models/Order.js';
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



// --- ROUTES GIỎ HÀNG ---

// 1. API: Thêm sản phẩm vào giỏ
app.post('/api/cart/add', async (req, res) => {
  const { clerkId, productId, name, price, image, size, quantity } = req.body;

  // Validation
  if (!clerkId) {
    return res.status(400).json({ message: "Thiếu clerkId" });
  }
  if (!productId) {
    return res.status(400).json({ message: "Thiếu productId" });
  }
  if (!name || !price || !image || !size) {
    return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
  }
  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: "Số lượng không hợp lệ" });
  }

  try {
    let cart = await Cart.findOne({ clerkId });

    if (cart) {
      // Nếu đã có giỏ hàng, kiểm tra xem sản phẩm (cùng size) đã tồn tại chưa
      // Convert productId sang string để so sánh chính xác
      const productIdStr = String(productId);
      const itemIndex = cart.items.findIndex(
        p => String(p.productId) === productIdStr && p.size === size
      );

      if (itemIndex > -1) {
        // Nếu tồn tại rồi thì tăng số lượng
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Nếu chưa có thì thêm mới vào mảng items
        cart.items.push({ productId, name, price, image, size, quantity });
      }
      cart = await cart.save();
    } else {
      // Nếu chưa có giỏ hàng thì tạo mới hoàn toàn
      cart = await Cart.create({
        clerkId,
        items: [{ productId, name, price, image, size, quantity }]
      });
    }
    res.status(201).json(cart);
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    res.status(500).json({ message: "Lỗi khi thêm vào giỏ hàng", error: error.message });
  }
});

// 2. API: Lấy giỏ hàng của một người dùng
app.get('/api/cart/:clerkId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ clerkId: req.params.clerkId });
    if (!cart) return res.status(200).json({ items: [] });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy giỏ hàng", error });
  }
});

// 3. API: Xóa sản phẩm khỏi giỏ hàng
app.delete('/api/cart/remove', async (req, res) => {
  const { clerkId, productId, size } = req.body;
  try {
    let cart = await Cart.findOne({ clerkId });
    if (cart) {
      cart.items = cart.items.filter(item => !(item.productId == productId && item.size == size));
      await cart.save();
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error });
  }
});
// Route lấy toàn bộ đơn hàng
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy đơn hàng", error: error.message });
  }
});
// 2. Thêm Route POST để xử lý tạo đơn hàng
app.post('/api/orders', async (req, res) => {
  try {
    const { clerkId, items, totalAmount, address, status } = req.body;
    
    const newOrder = new Order({
      clerkId,
      items,
      totalAmount,
      address,
      status: status || 'Chờ xử lý'
    });

    const savedOrder = await newOrder.save();
    console.log("✅ Đã tạo đơn hàng mới:", savedOrder._id);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Lỗi tạo đơn hàng:", error.message);
    res.status(400).json({ message: "Lỗi dữ liệu đơn hàng", error: error.message });
  }
});

// Xóa đơn hàng
app.delete('/api/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa đơn hàng" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa" });
  }
});

// --- PHỤC VỤ GIAO DIỆN ADMIN ---
// Route cuối cùng để xử lý trang Admin (SPA)
// Thay "/{*any}" bằng "*" để đúng chuẩn Express catch-all
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(adminDistPath, "index.html"));
});
// Phục vụ các file tĩnh (css, js, images) từ thư mục dist của admin
app.use(express.static(adminDistPath));



// --- KẾT NỐI DATABASE & START SERVER ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connect Error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));