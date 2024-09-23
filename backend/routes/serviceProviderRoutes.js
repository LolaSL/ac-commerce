import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import { isAdmin } from '../utils.js';
import Project from '../models/projectModel.js';
import Message from '../models/messageModel.js';
import Earnings from '../models/earningModel.js';
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

export const isAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Invalid Token' });
      }
      req.serviceProvider = decoded; // Ensure this sets the correct service provider data
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
      console.log('ServiceProvider Info:', req.serviceProvider); // Debugging

      if (!req.serviceProvider || !req.serviceProvider._id) {
        return res.status(400).send({ message: 'ServiceProvider not found' });
      }

      const projects = await Project.find({ serviceProvider: req.serviceProvider._id });

      if (projects.length === 0) {
        return res.status(404).send({ message: 'No projects available' });
      }

      res.status(200).send(projects);
    } catch (error) {
      console.error('Error fetching projects:', error); // Log error details
      res.status(500).send({ message: 'Error loading projects' });
    }
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
// serviceProviderRouter.get(
//   '/earnings',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const earnings = await Earnings.aggregate([
//       { $match: { serviceProvider: req.serviceProvider._id } },
//       { $group: { _id: null, totalEarnings: { $sum: '$amount' } } },
//     ]);
//     res.send(earnings.length ? earnings[0].totalEarnings : 0);
//   })
// );

serviceProviderRouter.get(
  '/earnings',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const earnings = await Earnings.find()
        .populate({
          path: 'projectName', // Reference project details
          select: 'name hoursWorked', // Fetch project name and hoursWorked fields
        })
        .populate('serviceProvider', 'name'); // Optionally populate service provider name

      if (earnings.length === 0) {
        res.status(404).send({ message: 'No earnings found' });
        return;
      }

      res.status(200).send(earnings);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);
//   '/earnings',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     // Log service provider ID for debugging
//     console.log('Service Provider ID:', req.serviceProvider._id);

//     // Aggregate the earnings data
//     const earnings = await Earnings.aggregate([
//       { $match: { serviceProvider: req.serviceProvider._id } },
//       {
//         $group: {
//           _id: null,
//           totalEarnings: { $sum: '$amount' },
//           totalHours: { $sum: '$hoursWorked' },
//         },
//       },

//     ]);

//     // Log aggregated earnings data for debugging
//     console.log('Aggregated Earnings:', earnings);

//     // Check if earnings data is found
//     if (earnings.length === 0) {
//       console.log('No earnings data found for this service provider');
//     }

//     // Return the earnings and hours worked or zero if none found
//     res.send(
//       earnings.length
//         ? { totalEarnings: earnings[0].totalEarnings, totalHours: earnings[0].totalHours }
//         : { totalEarnings: 0, totalHours: 0 }
//     );
//   })
// );
// serviceProviderRouter.get(
//   '/hours',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const projects = await Project.find({ serviceProvider: req.serviceProvider._id });
//     const totalHours = projects.reduce((sum, project) => sum + project.hoursWorked, 0);
//     res.send({ totalHours });
//   })
// );


serviceProviderRouter.get(
  '/hours',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // Ensure req.serviceProvider._id contains the correct service provider ID
    const earnings = await Earnings.find({ serviceProvider: req.serviceProvider._id }).populate('projectName');

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
