import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  items: Array,
  totalAmount: Number,
  status: { type: String, default: 'Chờ xử lý' }, // Chờ xử lý, Đang giao, Đã giao
  address: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);