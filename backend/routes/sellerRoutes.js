import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Seller from '../models/sellerModel.js';
import { isAuth, isAdmin } from '../utils.js';

const sellerRouter = express.Router();

sellerRouter.get(
  '/all',
  expressAsyncHandler(async (req, res) => {
      try {
          const sellers = await Seller.find({});
          res.json(sellers);
      } catch (err) {
          res.status(500).json({ message: err.message });
      }
  })
);


sellerRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const pageSize = 10;
      const page = Number(req.query.page) || 1;

      const countSellers = await Seller.countDocuments();
      const sellers = await Seller.find({})
        .skip(pageSize * (page - 1))
        .limit(pageSize);

      res.send({
        sellers,
        page,
        pages: Math.ceil(countSellers / pageSize),
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);


sellerRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const seller = await Seller.findById(req.params.id);
    if (seller) {
      res.send(seller);
    } else {
      res.status(404).send({ message: 'Seller Not Found' });
    }
  })
);


sellerRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newSeller = new Seller({
      name: req.body.name,
      brand: req.body.brand,
      info: req.body.info,
    });
    try {
      const seller = await newSeller.save();
      res.status(201).send({ _id: seller._id, message: 'Seller Created' });
    } catch (err) {
      res.status(500).send({ message: 'Error creating seller' });
    }
  })
);


sellerRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const seller = await Seller.findById(req.params.id);
    if (seller) {
      seller.name = req.body.name || seller.name;
      seller.brand = req.body.brand || seller.brand;
      seller.info = req.body.info || seller.info;
      try {
        const updatedSeller = await seller.save();
        res.send({ message: 'Seller Updated', seller: updatedSeller });
      } catch (error) {
        res.status(400).send({ message: 'Invalid Seller Data', error: error.message });
      }
    } else {
      res.status(404).send({ message: 'Seller Not Found' });
    }
  })
);


sellerRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const seller = await Seller.findById(req.params.id);
    if (seller) {
      if (seller.reviews.find((x) => x.user.toString() === req.user._id.toString())) {
        return res.status(400).send({ message: 'You already submitted a review' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
        user: req.user._id,
      };

      seller.reviews.push(review);
      seller.numReviews = seller.reviews.length;
      seller.rating =
        seller.reviews.reduce((a, c) => c.rating + a, 0) / seller.reviews.length;

      const updatedSeller = await seller.save();
      res.status(201).send({
        message: 'Review Added',
        review: updatedSeller.reviews[updatedSeller.reviews.length - 1],
        numReviews: updatedSeller.numReviews,
        rating: updatedSeller.rating,
      });
    } else {
      res.status(404).send({ message: 'Seller Not Found' });
    }
  })
);

sellerRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const seller = await Seller.findById(req.params.id);
    if (seller) {
      await seller.deleteOne();;
      res.send({ message: 'Seller Deleted' });
    } else {
      res.status(404).send({ message: 'Seller Not Found' });
    }
  })
);

export default sellerRouter;

