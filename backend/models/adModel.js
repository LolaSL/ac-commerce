
import mongoose from 'mongoose';

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'active'], default: 'pending' },
  },
  { timestamps: true }
);

const Ad = mongoose.model('Ad', adSchema);
export default Ad;
