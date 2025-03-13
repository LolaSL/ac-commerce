import express from 'express';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import Seller from '../models/sellerModel.js';
import Contact from '../models/contactModel.js';
import ServiceProvider from '../models/serviceProviderModel.js';
import Project from '../models/projectModel.js';
import Message from '../models/messageModel.js';
import Earnings from '../models/earningModel.js';
import Blog from '../models/blogModel.js';
import data from '../data.js';
import Notification from '../models/notificationModel.js';
import Ad from '../models/adModel.js';



const seedRouter = express.Router();


seedRouter.get('/', async (req, res) => {
  try {
    await Product.deleteMany({});
    await User.deleteMany({});
    await Seller.deleteMany({});
    await Contact.deleteMany({});
    await ServiceProvider.deleteMany({});
    await Project.deleteMany({});
    await Message.deleteMany({});
    await Earnings.deleteMany({});
    await Blog.deleteMany({});
    await Notification.deleteMany({});
    await Ad.deleteMany({});

    const createdServiceProviders = await ServiceProvider.insertMany(data.serviceProviders);


    const serviceProviderIds = createdServiceProviders.map(sp => sp._id.toString());


    const projectsWithIds = data.projects.map((project, index) => ({
      ...project,
      serviceProvider: serviceProviderIds[index % serviceProviderIds.length],
    }));

    const createdProjects = await Project.insertMany(projectsWithIds);


    const projectIds = createdProjects.map(project => project._id.toString());


    const messagesWithIds = data.messages.map((message, index) => ({
      ...message,
      serviceProvider: serviceProviderIds[index % serviceProviderIds.length],
    }));


    const earningsWithIds = data.earnings.map((earning, index) => ({
      ...earning,
      serviceProvider: serviceProviderIds[index % serviceProviderIds.length],
      projectName: projectIds[index % projectIds.length],
    }));
    console.log('Earnings Seed Data:', earningsWithIds);

    const createdMessages = await Message.insertMany(messagesWithIds);
    const createdEarnings = await Earnings.insertMany(earningsWithIds);


    const createdProducts = await Product.insertMany(data.products);
    const createdUsers = await User.insertMany(data.users);
    const createdSellers = await Seller.insertMany(data.sellers);
    console.log('Created Sellers:', createdSellers);

    const createdContacts = await Contact.insertMany(data.contacts);
    const createdBlogs = await Blog.insertMany(data.blogs);
    const createdNotifications = await Notification.insertMany(data.notifications);
    console.log('Inserting Ads...');
    const createdAds = await Ad.insertMany(data.Ads);
    console.log('Ads Created:', createdAds);


    res.send({
      createdProducts,
      createdUsers,
      createdSellers,
      createdContacts,
      createdServiceProviders,
      createdProjects,
      createdMessages,
      createdEarnings,
      createdBlogs,
      createdNotifications,
      createdAds
    });
  } catch (error) {
    res.status(500).send({ message: 'Error seeding data', error: error.message });
  }
});

export default seedRouter;
