import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const serviceProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  typeOfProvider: {
    type: String,
    required: true,
  },
  phone: {
    type: String, required: true
  },
  company: {
    type: String, required: true
  },
  experience: {
    type: Number, required: true
  },
  portfolio: {
    type: String,  
  },
}, { timestamps: true });


serviceProviderSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();  // Skip if password is not modified
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


serviceProviderSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();  
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

serviceProviderSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);

export default ServiceProvider;
