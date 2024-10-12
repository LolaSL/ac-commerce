import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { isAdmin, isAuth } from '../utils.js';
import Product from '../models/productModel.js';
import DesignModel from '../models/designModel.js';


const upload = multer();

const uploadRouter = express.Router();

uploadRouter.post(
  '/',
  isAuth,
  isAdmin,
  upload.single('file'),
  async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);

    const product = await Product.findById(req.body.productId);
    if (product) {
      product.images.push(result.secure_url); 
      await product.save(); 
    }

    res.send(result);
  }
);


uploadRouter.post(
  '/upload-design',
  isAuth,
  upload.single('file'),
  async (req, res) => {
    try {
      const result = await streamUpload(req);

      const newDesign = new DesignModel({
        title: req.body.title,
        country: req.body.country,
        typeOfProperty: req.body.typeOfProperty,
        floorNumber: req.body.floorNumber,
        directionOfVentilation: req.body.directionOfVentilation,
        numberOfRooms: req.body.numberOfRooms,
        roomArea: req.body.roomArea,
        file: result.secure_url, 
      });

      await newDesign.save(); 

      return res.status(201).json({
        message: 'Design uploaded successfully',
        design: newDesign,
      });
    } catch (error) {
      console.error('Error uploading design:', error);
      res.status(500).json({ message: 'Design upload failed', error: error.message });
    }
  }
);


export default uploadRouter;
