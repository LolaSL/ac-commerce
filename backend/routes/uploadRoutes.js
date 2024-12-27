import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { isAdmin, isAuth } from '../utils.js';
import Product from '../models/productModel.js';
import { extractTextFromPDF } from '../utils/pdfUtils.js';

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
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    try {

      const result = await streamUpload(req);

    
      let extractedText = '';
      if (req.file.mimetype === 'application/pdf') {
        extractedText = await extractTextFromPDF(req.file.buffer);
      }

    
      const product = await Product.findById(req.body.productId);
      if (product) {
        product.documents.push({
          url: result.secure_url,
          extractedText: extractedText,
        });
        await product.save();
      } else {
        return res.status(404).send({ message: 'Product not found' });
      }

      res.send({
        message: 'File uploaded successfully',
        url: result.secure_url,
        extractedText: extractedText, 
      });
    } catch (error) {
      console.error('Error during file upload:', error);
      res.status(500).send({ message: 'Error uploading file', error: error.message });
    }
  }
);

export default uploadRouter;
