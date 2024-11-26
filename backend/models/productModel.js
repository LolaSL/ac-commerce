import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const documentSchema = new mongoose.Schema({
  url: { type: String, required: true }, 
  type: { type: String, enum: ['PDF', 'Image', 'Text', 'HTML'], default: 'PDF' }, 
 description: String
});



const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [String],
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema],
    features: [{ type: String }],
    btu: { type: Number },
    areaCoverage: { type: Number },
    energyEfficiency: { type: Number },
    documents: [documentSchema], 
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
