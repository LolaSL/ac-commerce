import express from 'express';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import Seller from '../models/sellerModel.js';
import Contact from '../models/contactModel.js';
import ServiceProvider from '../models/serviceProviderModel.js';
import Project from '../models/projectModel.js';
import Message from '../models/messageModel.js';
import Earnings from '../models/earningModel.js';
import data from '../data.js';

const seedRouter = express.Router();

// Route to seed all data
seedRouter.get('/', async (req, res) => {
  try {
    // Delete existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Seller.deleteMany({});
    await Contact.deleteMany({});
    await ServiceProvider.deleteMany({});
    await Project.deleteMany({});
    await Message.deleteMany({});
    await Earnings.deleteMany({});

    // Seed Service Providers
    const createdServiceProviders = await ServiceProvider.insertMany(data.serviceProviders);

    // Extract Service Provider IDs
    const serviceProviderIds = createdServiceProviders.map(sp => sp._id.toString());

    // Update Projects with valid Service Provider IDs
    const projectsWithIds = data.projects.map((project, index) => ({
      ...project,
      serviceProvider: serviceProviderIds[index % serviceProviderIds.length],
    }));

    // Seed Projects
    const createdProjects = await Project.insertMany(projectsWithIds);

    // Extract Project IDs
    const projectIds = createdProjects.map(project => project._id.toString());

    // Update Messages with valid Service Provider IDs
    const messagesWithIds = data.messages.map((message, index) => ({
      ...message,
      serviceProvider: serviceProviderIds[index % serviceProviderIds.length],
    }));

    // Update Earnings with valid Project IDs
    const earningsWithIds = data.earnings.map((earning, index) => ({
      ...earning,
      serviceProvider: serviceProviderIds[index % serviceProviderIds.length],
      projectName: projectIds[index % projectIds.length], // Assign valid Project IDs
    }));
    console.log('Earnings Seed Data:', earningsWithIds);
    // Seed Messages and Earnings
    const createdMessages = await Message.insertMany(messagesWithIds);
    const createdEarnings = await Earnings.insertMany(earningsWithIds);

    // Seed other collections
    const createdProducts = await Product.insertMany(data.products);
    const createdUsers = await User.insertMany(data.users);
    const createdSellers = await Seller.insertMany(data.sellers);
    const createdContacts = await Contact.insertMany(data.contacts);

    res.send({
      createdProducts,
      createdUsers,
      createdSellers,
      createdContacts,
      createdServiceProviders,
      createdProjects,
      createdMessages,
      createdEarnings
    });
  } catch (error) {
    res.status(500).send({ message: 'Error seeding data', error: error.message });
  }
});

export default seedRouter;
