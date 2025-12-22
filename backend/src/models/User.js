import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // ID từ Clerk để liên kết
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  imageUrl: { type: String },
  role: { type: String, default: 'user' }, // Phân quyền: user hoặc admin
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
export default User;