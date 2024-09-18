import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the ServiceProvider schema
const serviceProviderSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        typeOfProvider: { type: String, required: true },
        phone: { type: String, required: true },
        company: { type: String },
        experience: { type: Number },
        portfolio: { type: String },
        isAdmin: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

// Password comparison method
serviceProviderSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Compile the schema into a model
const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);

export default ServiceProvider;

