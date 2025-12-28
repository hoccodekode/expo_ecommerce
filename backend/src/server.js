import 'dotenv/config'; // Luôn để dòng này trên cùng
import express from 'express';
import { Webhook } from 'svix';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import { upload } from './config/cloudinary.js';
import { createVNPayUrl, verifyVNPaySignature, getVNPayResponseMessage } from './config/vnpay.js';
// Import Models
import User from './models/User.js';
import Product from './models/Product.js';
import Cart from './models/Cart.js';
import Order from './models/Order.js';
import Address from './models/Address.js';
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
    console.log("📥 Nhận request tạo sản phẩm:", {
      name: req.body.name,
      hasImage: !!req.body.image,
      imageLength: req.body.image ? req.body.image.length : 0,
      imagePreview: req.body.image ? req.body.image.substring(0, 50) + "..." : "Không có"
    });

    // Validation: Kiểm tra các trường bắt buộc
    if (!req.body.name) {
      return res.status(400).json({ message: "Tên sản phẩm là bắt buộc" });
    }
    if (!req.body.image || req.body.image.trim() === "") {
      return res.status(400).json({ message: "Ảnh sản phẩm là bắt buộc" });
    }
    if (!req.body.originalPrice) {
      return res.status(400).json({ message: "Giá gốc là bắt buộc" });
    }

    // Đảm bảo price được tính đúng TRƯỚC KHI tạo Product
    if (!req.body.price) {
      req.body.price = req.body.discountPrice || req.body.originalPrice;
    }
    
    // Đảm bảo price là số
    req.body.price = Number(req.body.price);
    req.body.originalPrice = Number(req.body.originalPrice);
    if (req.body.discountPrice) {
      req.body.discountPrice = Number(req.body.discountPrice);
    }

    console.log("💰 Giá sản phẩm:", {
      originalPrice: req.body.originalPrice,
      discountPrice: req.body.discountPrice,
      finalPrice: req.body.price
    });

    // Đảm bảo updatedAt được set
    req.body.updatedAt = Date.now();

    const newProduct = new Product(req.body);
    await newProduct.save();
    
    console.log("✅ Tạo sản phẩm thành công:", newProduct._id);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("❌ Lỗi khi tạo sản phẩm:", error);
    res.status(400).json({ 
      message: "Lỗi khi tạo sản phẩm", 
      error: error.message,
      details: error.errors 
    });
  }
});

// API lấy một sản phẩm theo ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error: error.message });
  }
});

// API cập nhật sản phẩm
app.put('/api/products/:id', async (req, res) => {
  try {
    // Đảm bảo price được tính đúng
    if (req.body.originalPrice || req.body.discountPrice) {
      req.body.price = req.body.discountPrice || req.body.originalPrice;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    res.status(400).json({ message: "Lỗi khi cập nhật sản phẩm", error: error.message });
  }
});

// API xóa sản phẩm
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    
    res.status(200).json({ message: "Đã xóa sản phẩm thành công", product: deletedProduct });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error: error.message });
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
    const clerkId = req.params.clerkId;
    console.log("🔍 Đang tìm giỏ hàng cho clerkId:", clerkId);
    
    // Kiểm tra xem có bao nhiêu cart với clerkId này
    const allCarts = await Cart.find({ clerkId });
    console.log(`📦 Tìm thấy ${allCarts.length} giỏ hàng với clerkId: ${clerkId}`);
    
    if (allCarts.length > 1) {
      console.log("⚠️ CẢNH BÁO: Có nhiều giỏ hàng với cùng clerkId!");
      allCarts.forEach((cart, index) => {
        console.log(`  Cart ${index + 1}: _id=${cart._id}, items=${cart.items.length}, createdAt=${cart.createdAt}`);
      });
    }
    
    // Lấy cart mới nhất (nếu có nhiều)
    const cart = await Cart.findOne({ clerkId }).sort({ createdAt: -1 });
    
    if (!cart) {
      console.log("✅ Không tìm thấy giỏ hàng, trả về giỏ hàng trống");
      return res.status(200).json({ items: [] });
    }
    
    console.log(`✅ Tìm thấy giỏ hàng: _id=${cart._id}, items=${cart.items.length}`);
    console.log("📋 Chi tiết items:", JSON.stringify(cart.items, null, 2));
    
    res.status(200).json(cart);
  } catch (error) {
    console.error("❌ Lỗi khi lấy giỏ hàng:", error);
    res.status(500).json({ message: "Lỗi khi lấy giỏ hàng", error: error.message });
  }
});

// 3. API: Cập nhật số lượng sản phẩm trong giỏ hàng
app.put('/api/cart/update', async (req, res) => {
  const { clerkId, productId, size, quantity } = req.body;
  
  if (!clerkId || !productId || !size || quantity === undefined) {
    return res.status(400).json({ message: "Thiếu thông tin" });
  }
  
  if (quantity < 1) {
    return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
  }

  try {
    let cart = await Cart.findOne({ clerkId });
    if (cart) {
      const productIdStr = String(productId);
      const itemIndex = cart.items.findIndex(
        p => String(p.productId) === productIdStr && p.size === size
      );
      
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        cart = await cart.save();
        res.status(200).json(cart);
      } else {
        res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
      }
    } else {
      res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật số lượng", error: error.message });
  }
});

// 4. API: Xóa sản phẩm khỏi giỏ hàng
app.delete('/api/cart/remove', async (req, res) => {
  const { clerkId, productId, size } = req.body;
  try {
    let cart = await Cart.findOne({ clerkId });
    if (cart) {
      const productIdStr = String(productId);
      cart.items = cart.items.filter(
        item => !(String(item.productId) === productIdStr && item.size === size)
      );
      await cart.save();
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error });
  }
});

// 5. API: Xóa toàn bộ giỏ hàng
app.delete('/api/cart/clear/:clerkId', async (req, res) => {
  try {
    const clerkId = req.params.clerkId;
    console.log("🗑️ Đang xóa giỏ hàng cho clerkId:", clerkId);
    
    // Kiểm tra xem có bao nhiêu cart trước khi xóa
    const cartsBefore = await Cart.find({ clerkId });
    console.log(`📊 Tìm thấy ${cartsBefore.length} giỏ hàng trước khi xóa`);
    
    if (cartsBefore.length > 0) {
      cartsBefore.forEach((cart, index) => {
        console.log(`  Cart ${index + 1}: _id=${cart._id}, items=${cart.items.length}`);
      });
    }
    
    // Xóa TẤT CẢ cart với clerkId này (nếu có nhiều)
    const result = await Cart.deleteMany({ clerkId });
    console.log(`✅ Đã xóa ${result.deletedCount} giỏ hàng`);
    
    // Kiểm tra lại sau khi xóa
    const cartsAfter = await Cart.find({ clerkId });
    console.log(`🔍 Kiểm tra lại: Còn ${cartsAfter.length} giỏ hàng sau khi xóa`);
    
    if (cartsAfter.length > 0) {
      console.log("⚠️ CẢNH BÁO: Vẫn còn giỏ hàng sau khi xóa!");
      cartsAfter.forEach((cart, index) => {
        console.log(`  Cart còn lại ${index + 1}: _id=${cart._id}, items=${cart.items.length}`);
      });
    }
    
    res.status(200).json({ 
      message: "Đã xóa toàn bộ giỏ hàng", 
      deletedCount: result.deletedCount,
      remainingCarts: cartsAfter.length
    });
  } catch (error) {
    console.error("❌ Lỗi khi xóa giỏ hàng:", error);
    res.status(500).json({ message: "Lỗi khi xóa giỏ hàng", error: error.message });
  }
});

// 6. API: Debug - Lấy tất cả cart của một user (để kiểm tra)
app.get('/api/cart/debug/:clerkId', async (req, res) => {
  try {
    const carts = await Cart.find({ clerkId: req.params.clerkId });
    res.status(200).json({ 
      clerkId: req.params.clerkId,
      totalCarts: carts.length,
      carts: carts.map(cart => ({
        _id: cart._id,
        itemsCount: cart.items.length,
        items: cart.items,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách giỏ hàng", error: error.message });
  }
});

// --- ROUTES ĐỊA CHỈ GIAO HÀNG ---

// 1. API: Lấy tất cả địa chỉ của user
app.get('/api/addresses/:clerkId', async (req, res) => {
  try {
    const addresses = await Address.find({ clerkId: req.params.clerkId }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json(addresses);
  } catch (error) {
    console.error('Lỗi khi lấy địa chỉ:', error);
    res.status(500).json({ message: 'Lỗi khi lấy địa chỉ', error: error.message });
  }
});

// 2. API: Thêm địa chỉ mới
app.post('/api/addresses', async (req, res) => {
  try {
    const { clerkId, name, phone, address, isDefault } = req.body;
    
    if (!clerkId || !name || !phone || !address) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    // Nếu địa chỉ mới là default, bỏ default của các địa chỉ cũ
    if (isDefault) {
      await Address.updateMany(
        { clerkId },
        { $set: { isDefault: false } }
      );
    }

    const newAddress = new Address({
      clerkId,
      name,
      phone,
      address,
      isDefault: isDefault || false
    });

    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Lỗi khi thêm địa chỉ:', error);
    res.status(500).json({ message: 'Lỗi khi thêm địa chỉ', error: error.message });
  }
});

// 3. API: Cập nhật địa chỉ
app.put('/api/addresses/:id', async (req, res) => {
  try {
    const { name, phone, address, isDefault } = req.body;
    
    const existingAddress = await Address.findById(req.params.id);
    if (!existingAddress) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }

    // Nếu set làm default, bỏ default của các địa chỉ khác
    if (isDefault && !existingAddress.isDefault) {
      await Address.updateMany(
        { clerkId: existingAddress.clerkId, _id: { $ne: req.params.id } },
        { $set: { isDefault: false } }
      );
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      { name, phone, address, isDefault },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedAddress);
  } catch (error) {
    console.error('Lỗi khi cập nhật địa chỉ:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật địa chỉ', error: error.message });
  }
});

// 4. API: Xóa địa chỉ
app.delete('/api/addresses/:id', async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }

    const wasDefault = address.isDefault;
    const clerkId = address.clerkId;

    await Address.findByIdAndDelete(req.params.id);

    // Nếu xóa địa chỉ default, set địa chỉ đầu tiên làm default
    if (wasDefault) {
      const firstAddress = await Address.findOne({ clerkId }).sort({ createdAt: 1 });
      if (firstAddress) {
        firstAddress.isDefault = true;
        await firstAddress.save();
      }
    }

    res.status(200).json({ message: 'Đã xóa địa chỉ thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa địa chỉ:', error);
    res.status(500).json({ message: 'Lỗi khi xóa địa chỉ', error: error.message });
  }
});

// 5. API: Đặt địa chỉ làm mặc định
app.put('/api/addresses/:id/set-default', async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }

    // Bỏ default của tất cả địa chỉ khác
    await Address.updateMany(
      { clerkId: address.clerkId },
      { $set: { isDefault: false } }
    );

    // Set địa chỉ này làm default
    address.isDefault = true;
    await address.save();

    res.status(200).json(address);
  } catch (error) {
    console.error('Lỗi khi set default:', error);
    res.status(500).json({ message: 'Lỗi khi set default', error: error.message });
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
    const { clerkId, items, totalAmount, address, status, paymentMethod, discountCode, discountAmount } = req.body;
    
    const newOrder = new Order({
      clerkId,
      items,
      totalAmount,
      address,
      status: status || 'Chờ xử lý',
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: 'pending',
      discountCode,
      discountAmount: discountAmount || 0
    });

    const savedOrder = await newOrder.save();
    console.log("✅ Đã tạo đơn hàng mới:", savedOrder._id);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Lỗi tạo đơn hàng:", error.message);
    res.status(400).json({ message: "Lỗi dữ liệu đơn hàng", error: error.message });
  }
});

// Cập nhật trạng thái đơn hàng
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    
    res.json(updatedOrder);
  } catch (error) {
    console.error("❌ Lỗi cập nhật đơn hàng:", error.message);
    res.status(400).json({ message: "Lỗi cập nhật đơn hàng", error: error.message });
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

// --- VNPAY PAYMENT ROUTES ---

// 1. Create VNPay payment URL
app.post('/api/payment/vnpay/create', async (req, res) => {
  try {
    const { orderId, amount, orderInfo } = req.body;
    
    if (!orderId || !amount) {
      return res.status(400).json({ message: 'Thiếu thông tin thanh toán' });
    }

    // Get client IP - handle IPv6 format
    let ipAddr = req.headers['x-forwarded-for'] || 
                 req.connection.remoteAddress || 
                 req.socket.remoteAddress ||
                 '127.0.0.1';
    
    // If IPv6, extract IPv4 or use default
    if (ipAddr.includes('::ffff:')) {
      ipAddr = ipAddr.split('::ffff:')[1];
    } else if (ipAddr.includes(',')) {
      ipAddr = ipAddr.split(',')[0].trim();
    }
    
    // Ensure valid IPv4 format
    if (!ipAddr.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
      ipAddr = '127.0.0.1';
    }

    console.log('📝 VNPay Payment Request:', {
      orderId,
      amount,
      orderInfo,
      ipAddr
    });

    // Create payment URL
    const paymentUrl = createVNPayUrl(
      orderId,
      amount,
      orderInfo || `Thanh toan don hang ${orderId}`,
      ipAddr
    );

    console.log('✅ Tạo VNPay URL thành công cho đơn hàng:', orderId);
    console.log('🔗 Payment URL:', paymentUrl);
    res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error('❌ Lỗi tạo VNPay URL:', error);
    res.status(500).json({ message: 'Lỗi tạo link thanh toán', error: error.message });
  }
});

// 2. Handle VNPay return callback
app.get('/api/payment/vnpay/return', async (req, res) => {
  try {
    const vnpParams = req.query;
    
    console.log('📥 VNPay callback nhận được:', vnpParams);

    // Verify signature
    const isValid = verifyVNPaySignature(vnpParams);
    
    if (!isValid) {
      console.error('❌ Chữ ký VNPay không hợp lệ');
      return res.send(createRedirectHTML('myapp://payment-result?success=false&message=Invalid+signature'));
    }

    const orderId = vnpParams.vnp_TxnRef;
    const responseCode = vnpParams.vnp_ResponseCode;
    const transactionId = vnpParams.vnp_TransactionNo;
    const amount = vnpParams.vnp_Amount / 100; // Convert back from VNPay format

    console.log('💳 Thông tin thanh toán:', {
      orderId,
      responseCode,
      transactionId,
      amount
    });

    // Update order based on payment result
    if (responseCode === '00') {
      // Payment successful
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: 'paid',
          vnpayTransactionId: transactionId,
          status: 'Chờ xử lý' // Order confirmed after payment
        },
        { new: true }
      );

      if (updatedOrder) {
        console.log('✅ Cập nhật đơn hàng thành công:', orderId);
        // Return HTML that opens the app
        return res.send(createRedirectHTML(`myapp://payment-result?success=true&orderId=${orderId}&amount=${amount}`));
      } else {
        console.error('❌ Không tìm thấy đơn hàng:', orderId);
        return res.send(createRedirectHTML('myapp://payment-result?success=false&message=Order+not+found'));
      }
    } else {
      // Payment failed
      const message = getVNPayResponseMessage(responseCode);
      await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: 'failed',
          status: 'Đã hủy'
        }
      );

      console.log('❌ Thanh toán thất bại:', message);
      return res.send(createRedirectHTML(`myapp://payment-result?success=false&message=${encodeURIComponent(message)}`));
    }
  } catch (error) {
    console.error('❌ Lỗi xử lý VNPay callback:', error);
    return res.send(createRedirectHTML('myapp://payment-result?success=false&message=Server+error'));
  }
});

// Helper function to create redirect HTML for deep linking
function createRedirectHTML(deepLink) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Đang chuyển hướng...</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          max-width: 400px;
        }
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 4px solid white;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .message {
          margin-top: 1rem;
          font-size: 1.1rem;
        }
        .manual-link {
          margin-top: 2rem;
          padding: 12px 24px;
          background: white;
          color: #667eea;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="spinner"></div>
        <div class="message">Đang quay về ứng dụng...</div>
        <a href="${deepLink}" class="manual-link">Nhấn vào đây nếu không tự động chuyển</a>
      </div>
      <script>
        // Try to open the app immediately
        window.location.href = '${deepLink}';
        
        // Fallback: try again after a short delay
        setTimeout(function() {
          window.location.href = '${deepLink}';
        }, 500);
      </script>
    </body>
    </html>
  `;
}


// --- PHỤC VỤ GIAO DIỆN ADMIN ---
// Route cuối cùng để xử lý trang Admin (SPA)
// Thay "/{*any}" bằng "*" để đúng chuẩn Express catch-all
// Phục vụ các file tĩnh (css, js, images) từ thư mục dist của admin
app.use(express.static(adminDistPath));
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(adminDistPath, "index.html"));
});




// --- KẾT NỐI DATABASE & START SERVER ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connect Error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));