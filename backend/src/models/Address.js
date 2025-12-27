import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh theo clerkId
addressSchema.index({ clerkId: 1, isDefault: -1 });

const Address = mongoose.model('Address', addressSchema);

export default Address;
