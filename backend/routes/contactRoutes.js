import express from 'express';
import Contact from '../models/contactModel.js'; // Adjust the path as necessary

const contactRouter = express.Router();

contactRouter.post('/', async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newContact = new Contact({
      fullName,
      email,
      subject,
      message,
    });

    const savedContact = await newContact.save();

    res.status(201).json({
      message: 'Contact message sent successfully',
      contact: savedContact,
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Failed to save contact message' });
  }
});

export default contactRouter;
