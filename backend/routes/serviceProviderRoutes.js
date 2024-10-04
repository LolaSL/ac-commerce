import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import { isAdmin } from '../utils.js';
import Project from '../models/projectModel.js';
import Message from '../models/messageModel.js';
import Earnings from '../models/earningModel.js';
import ServiceProvider from '../models/serviceProviderModel.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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

export const isAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Invalid Token' });
      }
      req.serviceProvider = decoded;
      next();
    });
  } else {
    res.status(401).send({ message: 'Token Not Found' });
  }
};


const serviceProviderRouter = express.Router();

serviceProviderRouter.get(
  '/projects',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const serviceProviderId = req.serviceProvider._id
      const projects = await Project.find({ serviceProvider: serviceProviderId });

      if (projects.length === 0) {
        return res.status(404).send({ message: 'No projects available' });
      }

      res.status(200).send(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).send({ message: 'Error loading projects' });
    }
  })
);




serviceProviderRouter.get(
  '/messages',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const serviceProviderId = req.serviceProvider._id
    const messages = await Message.find({ serviceProvider: serviceProviderId });
    res.send(messages);
  })
);



serviceProviderRouter.get(
  '/earnings',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const serviceProviderId = req.serviceProvider._id
      // Filter by the logged-in service provider's ID
      const earnings = await Earnings.find({ serviceProvider: serviceProviderId })  // Filter earnings by logged-in service provider
        .populate({
          path: 'projectName', // Populate project details
          select: 'name hoursWorked', // Fetch project name and hoursWorked fields
        })
        .populate('serviceProvider', 'name'); // Optionally populate service provider name (if needed)

      if (earnings.length === 0) {
        res.status(404).send({ message: 'No earnings found for this service provider' });
        return;
      }

      res.status(200).send(earnings);  // Send back the filtered earnings data
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);


serviceProviderRouter.get(
  '/hours',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const serviceProviderId = req.serviceProvider._id
    // Ensure req.serviceProvider._id contains the correct service provider ID
    const earnings = await Earnings.find({ serviceProvider: serviceProviderId }).populate('projectName');

    console.log('Earnings:', earnings); // Check what you're getting from the database

    if (!earnings || earnings.length === 0) {
      return res.send({ totalHours: 0, projects: [] });
    }

    const totalHours = earnings.reduce((sum, earning) => sum + earning.hoursWorked, 0);

    // Format response
    res.send({
      totalHours,
      projects: earnings.map(e => ({
        _id: e._id,
        projectName: e.projectName, // Adjust according to your data structure
        hoursWorked: e.hoursWorked,
        date: e.date,
        amount: e.amount,
        status: e.status,
      })),
    });
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
  isAuth, // Ensure proper authentication middleware is in place
  expressAsyncHandler(async (req, res) => {
    try {
      const serviceProvider = await ServiceProvider.findById(req.params.id);
      if (!serviceProvider) {
        return res.status(404).send({ message: 'Service Provider not found' });
      }

      serviceProvider.name = req.body.name || serviceProvider.name;
      serviceProvider.email = req.body.email || serviceProvider.email;
      serviceProvider.typeOfProvider = req.body.typeOfProvider || serviceProvider.typeOfProvider;
      serviceProvider.experience = req.body.experience || serviceProvider.experience;

      // Handle password update only if provided
      if (req.body.password) {
        serviceProvider.password = bcrypt.hashSync(req.body.password, 8);
      }

      await serviceProvider.save();
      res.send({
        _id: serviceProvider._id,
        name: serviceProvider.name,
        email: serviceProvider.email,
        typeOfProvider: serviceProvider.typeOfProvider,
        isAdmin: serviceProvider.isAdmin,
        token: generateToken(serviceProvider),
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  })
);

export default serviceProviderRouter;
