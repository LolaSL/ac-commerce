import express from 'express';
import Quote from '../models/quoteModel.js';
import { isAuth, isAdmin } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';


const roomBTUMapping = {
  'bedroom': 850,
  'Living room + Windows': 1000,
  'Living room': 1000,
  'kitchen': 1000,
  'basement': 700,
  'Open space': 1100,
  'office': 900,
  'Meeting room': 1000,
};

const calculateBTU = (roomType, roomArea) => {
  const btuPerM2 = roomBTUMapping[roomType];
  if (!btuPerM2) throw new Error('Invalid room type');
  return btuPerM2 * roomArea;
};

const selectACUnit = async (requiredBTU) => {
  const product = await Product.findOne({
    btu: { $gte: requiredBTU },
  }).sort({ btu: 1 }); // Sort by BTU in ascending order to get the closest match

  return product ? product : 'No suitable AC unit found';
};


const quoteRouter = express.Router();

quoteRouter.get('/:id', isAuth, async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  if (quote) {
    res.send(quote);
  } else {
    res.status(404).send({ message: 'Quote Not Found' });
  }
});

quoteRouter.put('/:id', isAuth, async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  if (quote) {
    quote.name = req.body.name || quote.name;
    quote.email = req.body.email || quote.email;
    quote.image = req.body.image || quote.image;
    quote.phone = req.body.phone || quote.phone;
    quote.address = req.body.address || quote.address;
    quote.floorNumber = req.body.floorNumber || quote.floorNumber;
    quote.directionOfVentilation =
      req.body.directionOfVentilation || quote.directionOfVentilation;
    quote.roomType = req.body.roomType || quote.roomType;
    quote.wallLength = req.body.wallLength || quote.wallLength;
    quote.scaleSize = req.body.scaleSize || quote.scaleSize;
    const updatedQuote = await quote.save();
    res.send({ message: 'Quote Updated', quote: updatedQuote });
  } else {
    res.status(404).send({ message: 'Quote Not Found' });
  }
});

// // Create a new quote
quoteRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const {
        name,
        email,
        image,
        phone,
        address,
        floorNumber,
        directionOfVentilation,
        roomArea,
        roomType,
        wallLength,
        scaleSize,
      } = req.body;

      let calculatedArea = roomArea;
      if (!roomArea) {
        // Calculate area based on wall length and scale size
        calculatedArea = wallLength * scaleSize; // Simplified for example
      }

      const requiredBTU = calculateBTU(roomType, calculatedArea);
      const selectedProduct = await selectACUnit(requiredBTU);

      const newQuote = new Quote({
        name,
        email,
        image,
        phone,
        address,
        floorNumber,
        directionOfVentilation,
        numberOfRooms,
        roomArea: calculatedArea,
        selectedACUnit: selectedProduct.name,
      });

      const createdQuote = await newQuote.save();
      res.status(201).send({ message: 'New Quote Created', quote: createdQuote });
    } catch (error) {
      res.status(500).send({ message: 'Error in Creating Quote', error });
    }
  })
);

// Get all quotes (Admin only)
quoteRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  try {
    const quotes = await Quote.find({});
    res.send(quotes);
  } catch (error) {
    res.status(500).send({ message: 'Error in Fetching Quotes', error });
  }
})
);

// Get a single quote by ID
quoteRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (quote) {
      res.send(quote);
    } else {
      res.status(404).send({ message: 'Quote Not Found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error in Fetching Quote', error });
  }
})
);


quoteRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const quoteId = req.params.id;

    const quote = await Quote.findById(quoteId);
    if (quote) {
      quote.name = req.body.name;
      quote.email = req.body.email;
      quote.image = req.body.image;
      quote.phone = req.body.phone;
      quote.address = req.body.address;
      quote.floorNumber = req.body.floorNumber;
      quote.directionOfVentilation = req.body.directionOfVentilation;
      quote.roomType = req.body.roomType;
      quote.roomArea = req.body.roomArea;
      quote.wallLength = req.body.wallLength;
      quote.scaleSize = req.body.scaleSize;
      await quote.save();
      res.send({ message: 'Quote Updated' });
    } else {
      res.status(404).send({ message: 'Qoute Not Found' });
    } console.log(quote);
  })
);
// Delete a quote (Admin only)
quoteRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (quote) {
      await quote.remove();
      res.send({ message: 'Quote Deleted' });
    } else {
      res.status(404).send({ message: 'Quote Not Found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error in Deleting Quote', error });
  }
})
);

export default quoteRouter;
