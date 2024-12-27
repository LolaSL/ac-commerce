import mongoose from 'mongoose';


const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },  // Name to identify the counter
  count: { type: Number, required: true, default: 0 }    // Counter for tracking user sign-ups
});


const Counter = mongoose.model('Counter', counterSchema);

export default Counter;
