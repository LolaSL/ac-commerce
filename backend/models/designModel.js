import mongoose from 'mongoose';

const designSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    country: { type: String, required: true },
    typeOfProperty: { type: String, required: true }, 
    floorNumber: { type: Number, required: true }, 
    directionOfVentilation: { type: String, required: true }, 
    numberOfRooms: { type: Number, required: true }, 
    roomArea: { type: Number, required: true }, 
    file: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date }, 
  },
  {
    timestamps: true,
  }
);

const Design = mongoose.model('Design', designSchema);

export default Design;
