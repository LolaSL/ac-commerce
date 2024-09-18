import mongoose from 'mongoose';

const earningSchema = new mongoose.Schema(
    {
        serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Earning = mongoose.model('Earning', earningSchema);
export default Earning;
