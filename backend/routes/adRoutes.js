import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Ad from '../models/adModel.js';
import { isAuth, isAdmin } from '../utils.js';
import { createPayPalOrder } from "../config/paypal.js";

const adRouter = express.Router();


adRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const { title, image, link, price } = req.body;
      const ad = new Ad({ title, image, link, price, status: 'pending' });
      await ad.save();
      res.status(201).json(ad);
    } catch (error) {
      res.status(500).json({ message: 'Error creating ad', error });
    }
  })
);


adRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const ads = await Ad.find({ status: 'active' }).sort({ createdAt: -1 });
      res.json(ads);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching ads', error });
    }
  })
);


adRouter.post(
  '/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount) {
        return res.status(400).json({ message: 'Payment amount is required' });
      }

      const order = await createPayPalOrder(amount);
      res.json({ id: order.id });
    } catch (error) {
      console.error('PayPal Payment Error:', error);
      res.status(500).json({ message: 'PayPal payment failed', error });
    }
  })
);

adRouter.put(
  '/confirm/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const ad = await Ad.findById(req.params.id);
      if (!ad) {
        return res.status(404).json({ message: 'Ad not found' });
      }

      ad.status = 'active';
      await ad.save();
      res.json(ad);
    } catch (error) {
      res.status(500).json({ message: 'Error confirming ad', error });
    }
  })
);

export default adRouter;
