import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Link ảnh sản phẩm
  category: { type: String, required: true }, // Ví dụ: 'Clothes', 'Shoes'
  stock: { type: Number, default: 0 }, // Số lượng trong kho
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);
export default Product;