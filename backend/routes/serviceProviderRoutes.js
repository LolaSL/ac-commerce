import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import {  isAdmin } from '../utils.js';
import  Project  from '../models/projectModel.js';
import  Message  from '../models/messageModel.js';
import  Earning  from '../models/earningModel.js';
import  ServiceProvider  from '../models/serviceProviderModel.js';
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
const isAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.status(401).send({ message: 'Invalid token' });
        } else {
          req.serviceProvider = decoded; // Assuming decoded contains serviceProvider details
          next();
        }
      });
    } else {
      res.status(401).send({ message: 'No token provided' });
    }
  };
  
const serviceProviderRouter = express.Router();
serviceProviderRouter.get(
    '/projects',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const projects = await Project.find({ serviceProvider: req.serviceProvider._id });
      res.send(projects);
    })
  );
  
  // Get all messages for a specific service provider
  serviceProviderRouter.get(
    '/messages',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const messages = await Message.find({ serviceProvider: req.serviceProvider._id });
      res.send(messages);
    })
  );
  
  // Get total earnings for a specific service provider
  serviceProviderRouter.get(
    '/earnings',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const earnings = await Earning.aggregate([
        { $match: { serviceProvider: req.serviceProvider._id } },
        { $group: { _id: null, totalEarnings: { $sum: '$amount' } } },
      ]);
      res.send(earnings.length ? earnings[0].totalEarnings : 0);
    })
  );
  
  // Get total hours worked (optional, depends on tracking mechanism)
  serviceProviderRouter.get(
    '/hours',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const projects = await Project.find({ serviceProvider: req.serviceProvider._id });
      const totalHours = projects.reduce((sum, project) => sum + project.hoursWorked, 0);
      res.send({ totalHours });
    })
  );

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


// Service Provider Registration Route
serviceProviderRouter.post(
    '/register',
    expressAsyncHandler(async (req, res) => {
        const { name, email, password, typeOfProvider, phone, company, experience, portfolio } = req.body;

        // Check if the service provider already exists
        const existingProvider = await ServiceProvider.findOne({ email });
        if (existingProvider) {
            res.status(400).send({ message: 'Service Provider with this email already exists' });
            return;
        }

        // Hash the password before saving
        const hashedPassword = bcrypt.hashSync(password, 8);

        // Save the new service provider with the hashed password
        const serviceProvider = await new ServiceProvider({
            name,
            email,
            password: hashedPassword,  // Save the hashed password
            typeOfProvider,
            phone,
            company,
            experience,
            portfolio,
        }).save();

        // Return the service provider details with a token
        res.send({
            _id: serviceProvider._id,
            name: serviceProvider.name,
            email: serviceProvider.email,
            isAdmin: serviceProvider.isAdmin,
            token: generateToken(serviceProvider),
        });
    })
);

// Service Provider Login Route
serviceProviderRouter.post(
    '/login',
    expressAsyncHandler(async (req, res) => {
        const { email, password } = req.body;

        // Find the service provider by email
        const serviceProvider = await ServiceProvider.findOne({ email });

        // Check if the service provider exists and the password matches
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

        // Check if the service provider ID is present in the request params
        if (!serviceProviderId) {
            return res.status(400).json({ message: "Service Provider ID is required." });
        }

        // Find the service provider by ID
        const serviceProvider = await ServiceProvider.findById(serviceProviderId);

        if (serviceProvider) {
            // Update service provider fields based on the input
            serviceProvider.name = req.body.name || serviceProvider.name;
            serviceProvider.email = req.body.email || serviceProvider.email;

            // Update password if provided
            if (req.body.password) {
                // Ensure password is hashed before storing in the DB
                serviceProvider.password = bcrypt.hashSync(req.body.password, 8);
            }

            // Save updated service provider details
            const updatedServiceProvider = await serviceProvider.save();

            // Return updated details along with a new token if necessary
            res.send({
                _id: updatedServiceProvider._id,
                name: updatedServiceProvider.name,
                email: updatedServiceProvider.email,
                typeOfProvider: updatedServiceProvider.typeOfProvider,
                experience: updatedServiceProvider.experience,
                token: generateToken(updatedServiceProvider), // Generate a new token
            });
        } else {
            // Service provider not found
            res.status(404).send({ message: 'Service provider not found' });
        }
    })
);




export default serviceProviderRouter;
