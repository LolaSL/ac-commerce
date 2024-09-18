import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  floorNumber: { type: String, required: true },
  directionOfVentilation: [{ type: String, required: true }],
  roomArea: { type: Number, required: true },
  roomType: { type: Number, required: true },
  wallLength: { type: Number, required: true },
  scaleSize: { type: Number, required: true },
}, {
  timestamps: true,
});

const Quote = mongoose.model('Quote', quoteSchema);
export default Quote;