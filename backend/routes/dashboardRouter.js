// import express from 'express';
// import expressAsyncHandler from 'express-async-handler';
// import Project from '../models/projectModel.js';
// import Message from '../models/messageModel.js';
// import Earnings from '../models/earningModel.js';
// import { isAuth } from '../utils.js';

// const dashboardRouter = express.Router();

// // Fetch projects for the logged-in service provider
// dashboardRouter.get('/projects', isAuth, expressAsyncHandler(async (req, res) => {
//   const serviceProviderId = req.serviceProvider._id;
//   const projects = await Project.find({ serviceProvider: serviceProviderId });
//   res.send(projects);
// }));

// // Fetch messages for the logged-in service provider
// dashboardRouter.get('/messages', isAuth, expressAsyncHandler(async (req, res) => {
//   const serviceProviderId = req.serviceProvider._id;
//   const messages = await Message.find({ serviceProvider: serviceProviderId });
//   res.send(messages);
// }));

// // Fetch earnings for the logged-in service provider
// dashboardRouter.get('/earnings', isAuth, expressAsyncHandler(async (req, res) => {
//   const serviceProviderId = req.serviceProvider._id;
//   const earnings = await Earnings.find({ serviceProvider: serviceProviderId })
//     .populate({
//       path: 'projectName', // Populating project details
//       select: 'name hoursWorked', // Select the project name and hours worked
//     });
//   res.send(earnings);
// }));

// // Fetch total hours worked for all projects of the logged-in service provider
// dashboardRouter.get('/hours-worked', isAuth, expressAsyncHandler(async (req, res) => {
//   const serviceProviderId = req.serviceProvider._id;
//   const projects = await Project.find({ serviceProvider: serviceProviderId });

//   // Calculate total hours worked
//   const totalHoursWorked = projects.reduce((total, project) => total + (project.hoursWorked || 0), 0);

//   res.send({ totalHoursWorked });
// }));

// export default dashboardRouter;
