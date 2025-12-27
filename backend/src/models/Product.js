import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  originalPrice: { type: Number, required: true }, // Giá gốc
  discountPrice: { type: Number }, // Giá giảm giá (nếu có)
  price: { type: Number, required: true }, // Giá bán hiện tại (sẽ tự động tính từ originalPrice hoặc discountPrice)
  image: { type: String, required: true }, // Link ảnh sản phẩm
  category: { type: String, required: true }, // Thể loại: 'Áo thun', 'Áo khoác', 'Quần jean', 'Váy', etc.
  stock: { type: Number, default: 0 }, // Số lượng trong kho
  brand: { type: String }, // Thương hiệu
  size: [{ type: String }], // Các size có sẵn: ['S', 'M', 'L', 'XL']
  color: [{ type: String }], // Các màu có sẵn
  tags: [{ type: String }], // Tags để tìm kiếm
  isActive: { type: Boolean, default: true }, // Trạng thái sản phẩm (có đang bán không)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Không cần middleware, backend sẽ tự xử lý updatedAt

const Product = mongoose.model('Product', productSchema);
export default Product;