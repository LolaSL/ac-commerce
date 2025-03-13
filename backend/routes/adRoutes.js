import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Ad from '../models/adModel.js';
import { isAuth, isAdmin } from '../utils.js';
import paypal from "@paypal/paypal-server-sdk";
import { createPayPalOrder } from "../config/paypal.js";

const adRouter = express.Router();

// Create a new ad slot (Admin Only)
adRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { title, image, link, price } = req.body;
    const ad = new Ad({ title, image, link, price, status: 'pending' });
    await ad.save();
    res.status(201).json(ad);
  })
);

// Get active ads
adRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const ads = await Ad.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(ads);
  })
);


// Pay for an ad slot
// Pay for an ad slot
adRouter.post(
  '/pay',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const { amount } = req.body; // Removed unused adId

      const order = await createPayPalOrder(amount); 
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { currency_code: 'USD', value: amount },
          },
        ],
      });

      const response = await client.execute(request);
      res.json({ id: response.result.id });
    } catch (error) {
      console.error('PayPal Payment Error:', error);
      res.status(500).json({ message: 'PayPal payment failed' });
    }
  })
);


// Confirm payment and activate the ad
adRouter.put(
  '/confirm/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const ad = await Ad.findById(req.params.id);
    if (ad) {
      ad.status = 'active';
      await ad.save();
      res.json(ad);
    } else {
      res.status(404).json({ message: 'Ad not found' });
    }
  })
);

export default adRouter;

