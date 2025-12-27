import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  clerkId: { type: String, required: true }, // ID từ Clerk để biết giỏ hàng của ai
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      image: String,
      size: String,
      quantity: { type: Number, default: 1 }
    }
  ]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;