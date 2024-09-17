import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';
import ServiceProvider from '../models/serviceProviderModel.js';
import protectServiceProvider from '../authMiddleware.js';
import jwt from 'jsonwebtoken';

const generateToken = (serviceProvider) => {
    return jwt.sign(
        {
            _id: serviceProvider._id,
            name: serviceProvider.name,
            email: serviceProvider.email,
            isAdmin: serviceProvider.isAdmin,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '30d',
        }
    );
};

const serviceProviderRouter = express.Router();


serviceProviderRouter.get(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const serviceProviders = await ServiceProvider.find({});
        res.send(serviceProviders);
    })
);

serviceProviderRouter.get(
    '/dashboard',
    protectServiceProvider,
    (req, res) => {
        res.send('Service Provider Dashboard');
    }
);


serviceProviderRouter.post(
    '/register',
    expressAsyncHandler(async (req, res) => {
        const { name, email, password, typeOfProvider, phone, company, experience, portfolio } = req.body;

        const existingProvider = await ServiceProvider.findOne({ email });
        if (existingProvider) {
            res.status(400).send({ message: 'Service Provider with this email already exists' });
            return;
        }

        const serviceProvider = await new ServiceProvider({
            name,
            email,
            password,
            typeOfProvider,
            phone,
            company,
            experience,
            portfolio,
        }).save();

        res.send({
            _id: serviceProvider._id,
            name: serviceProvider.name,
            email: serviceProvider.email,
            isAdmin: serviceProvider.isAdmin,
            token: generateToken(serviceProvider),
        });
    })
);



serviceProviderRouter.post(
    '/login',
    expressAsyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const serviceProvider = await ServiceProvider.findOne({ email });

        if (serviceProvider && (await serviceProvider.matchPassword(password))) {
            res.send({
                _id: serviceProvider._id,
                name: serviceProvider.name,
                email: serviceProvider.email,
                isAdmin: serviceProvider.isAdmin,
                token: generateToken(serviceProvider),
            });
        } else {
            res.status(401).send({ message: 'Invalid email or password' });
        }
    })
);


serviceProviderRouter.put(
    '/profile/:id',
    isAuth, // Ensure this middleware is correctly handling service provider authentication
    expressAsyncHandler(async (req, res) => {
      const serviceProviderId = req.params.id;
      if (!serviceProviderId) {
        return res.status(400).json({ message: "Service Provider ID is required." });
      }
      
      // Find the service provider by ID from URL parameter
      const serviceProvider = await ServiceProvider.findById(serviceProviderId);
  
      if (serviceProvider) {
        serviceProvider.name = req.body.name || serviceProvider.name;
        serviceProvider.email = req.body.email || serviceProvider.email;
        if (req.body.password) {
          serviceProvider.password = bcrypt.hashSync(req.body.password, 8);
        }
  
        const updatedServiceProvider = await serviceProvider.save();
  
        // Return the full updated service provider info, including _id
        res.send({
          _id: updatedServiceProvider._id,
          name: updatedServiceProvider.name,
          email: updatedServiceProvider.email,
          typeOfProvider: updatedServiceProvider.typeOfProvider,
          experience: updatedServiceProvider.experience,
          token: generateToken(updatedServiceProvider), // Generate a new token if necessary
        });
      } else {
        res.status(404).send({ message: 'Service provider not found' });
      }
    })
  );
  


export default serviceProviderRouter;
