import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import Project from '../models/projectModel.js';
import Message from '../models/messageModel.js';
import Earnings from '../models/earningModel.js';
import ServiceProvider from '../models/serviceProviderModel.js';
import jwt from 'jsonwebtoken';


const serviceProviderRouter = express.Router();


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


export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Not authorized as an admin' });
  }
};


export const isAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Invalid Token' });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).send({ message: 'Token Not Found' });
  }
};


export const isServiceProvider = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(403).send({ message: 'Service Provider access required' });
  }
};


serviceProviderRouter.get('/', isAuth, isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const { query } = req;
      const page = parseInt(query.page) || 1;
      const pageSize = parseInt(query.pageSize) || 10;


      const skip = (page - 1) * pageSize;
      const limit = pageSize;


      const serviceProviders = await ServiceProvider.aggregate([
        {
          $lookup: {
            from: 'projects',
            localField: '_id',
            foreignField: 'serviceProvider',
            as: 'projects',
          },
        },
        {
          $lookup: {
            from: 'earnings',
            localField: '_id',
            foreignField: 'serviceProvider',
            as: 'earnings',
          },
        },
        {
          $addFields: {
            completedProjects: {
              $size: {
                $filter: {
                  input: '$projects',
                  as: 'project',
                  cond: { $eq: ['$$project.status', 'Completed'] },
                },
              },
            },
            inProgressProjects: {
              $size: {
                $filter: {
                  input: '$projects',
                  as: 'project',
                  cond: { $eq: ['$$project.status', 'In Progress'] },
                },
              },
            },
            totalEarnings: { $sum: '$earnings.amount' },
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);


      const totalServiceProviders = await ServiceProvider.countDocuments();


      const totalPages = Math.ceil(totalServiceProviders / pageSize);

      res.send({
        serviceProviders,
        currentPage: page,
        totalPages,
        totalServiceProviders,
      });
    } catch (err) {
      res.status(500).send({ message: 'Error fetching service providers', error: err.message });
    }
  })
);




serviceProviderRouter.get(
  '/projects',
  isAuth,
  isServiceProvider,
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





serviceProviderRouter.get('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const projects = await ProjectModel.find({ serviceProviderId: id });
    res.json(projects);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching projects' });
  }
});

serviceProviderRouter.get(
  '/messages',
  isAuth,
  isServiceProvider,
  expressAsyncHandler(async (req, res) => {
    const serviceProviderId = req.serviceProvider._id
    const messages = await Message.find({ serviceProvider: serviceProviderId });
    res.send(messages);
  })
);



serviceProviderRouter.get(
  '/earnings',
  isAuth,
  isServiceProvider,
  expressAsyncHandler(async (req, res) => {
    try {
      const serviceProviderId = req.serviceProvider._id

      const earnings = await Earnings.find({ serviceProvider: serviceProviderId })
        .populate({
          path: 'projectName',
          select: 'name hoursWorked',
        })
        .populate('serviceProvider', 'name');

      if (earnings.length === 0) {
        res.status(404).send({ message: 'No earnings found for this service provider' });
        return;
      }

      res.status(200).send(earnings);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
);


serviceProviderRouter.get(
  '/hours',
  isAuth,
  isServiceProvider,
  expressAsyncHandler(async (req, res) => {
    const serviceProviderId = req.serviceProvider._id

    const earnings = await Earnings.find({ serviceProvider: serviceProviderId }).populate('projectName');

    console.log('Earnings:', earnings);

    if (!earnings || earnings.length === 0) {
      return res.send({ totalHours: 0, projects: [] });
    }

    const totalHours = earnings.reduce((sum, earning) => sum + earning.hoursWorked, 0);


    res.send({
      totalHours,
      projects: earnings.map(e => ({
        _id: e._id,
        projectName: e.projectName,
        hoursWorked: e.hoursWorked,
        date: e.date,
        amount: e.amount,
        status: e.status,
      })),
    });
  })
);




serviceProviderRouter.get('/hours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const totalHours = await HoursModel.aggregate([
      { $match: { serviceProviderId: id } },
      { $group: { _id: null, totalHours: { $sum: "$hours" } } },
    ]);
    res.json(totalHours[0] || { totalHours: 0 });
  } catch (err) {
    res.status(500).send({ message: 'Error fetching hours' });
  }
});


serviceProviderRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const { name, email, password, typeOfProvider, phone, company, experience, portfolio } = req.body;

    const existingProvider = await ServiceProvider.findOne({ email });
    if (existingProvider) {
      res.status(400).send({ message: 'Service Provider with this email already exists' });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const serviceProvider = await new ServiceProvider({
      name,
      email,
      password: hashedPassword,
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


serviceProviderRouter.get("/:id", isAuth, expressAsyncHandler(async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.params.id);
    if (serviceProvider) {
      res.json(serviceProvider);
    } else {
      res.status(404).send({ message: "Service Provider not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
})
);


// PUT route to update service provider details
serviceProviderRouter.put("/:id", isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.params.id);
    if (serviceProvider) {
      serviceProvider.name = req.body.name || serviceProvider.name;
      serviceProvider.typeOfProvider =
        req.body.typeOfProvider || serviceProvider.typeOfProvider;
      serviceProvider.experience = req.body.experience || serviceProvider.experience;
      serviceProvider.email = req.body.email || serviceProvider.email;

      if (req.body.password) {
        serviceProvider.password = bcrypt.hashSync(req.body.password, 10);
      }

      const updatedServiceProvider = await serviceProvider.save();
      res.json({
        _id: updatedServiceProvider._id,
        name: updatedServiceProvider.name,
        typeOfProvider: updatedServiceProvider.typeOfProvider,
        experience: updatedServiceProvider.experience,
        email: updatedServiceProvider.email,
        token: generateToken(updatedServiceProvider),
      });
    } else {
      res.status(404).send({ message: "Service Provider not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
})
);

serviceProviderRouter.put('/edit/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const serviceProviderId = req.params.id;
  const { earnings, workingHours, project } = req.body;

  try {
    // Find the service provider by ID
    const serviceProvider = await ServiceProvider.findById(serviceProviderId);
    if (!serviceProvider) {
      return res.status(404).send({ message: 'Service Provider not found' });
    }

    // Allow admins to update any service provider's data
    // Allow users to update only their own data (if their _id matches)
    if (serviceProvider._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).send({ message: 'You are not authorized to update this profile' });
    }

    // Update the service provider's information
    serviceProvider.earnings = earnings || serviceProvider.earnings;
    serviceProvider.workingHours = workingHours || serviceProvider.workingHours;
    serviceProvider.project = project || serviceProvider.project;

    // Save the updated service provider
    const updatedServiceProvider = await serviceProvider.save();

    res.status(200).send({
      message: 'Service Provider updated successfully',
      serviceProvider: updatedServiceProvider,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating Service Provider' });
  }
}));


serviceProviderRouter.put(
  '/profile/:id',
  isAuth,
  isServiceProvider,
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
