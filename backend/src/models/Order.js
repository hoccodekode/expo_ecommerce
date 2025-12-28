import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  items: Array,
  totalAmount: Number,
  status: { type: String, default: 'Chờ xử lý' }, // Chờ xử lý, Đang giao, Hoàn thành, Đã hủy
  address: String,
  paymentMethod: { type: String, default: 'cash' }, // cash, momo, bank, vnpay
  paymentStatus: { type: String, default: 'pending' }, // pending, paid, failed
  vnpayTransactionId: { type: String }, // VNPay transaction reference
  discountCode: { type: String },
  discountAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);