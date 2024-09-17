import jwt from 'jsonwebtoken';
import ServiceProvider from './models/serviceProviderModel.js';

const protectServiceProvider = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the service provider by ID and exclude the password field
      req.serviceProvider = await ServiceProvider.findById(decoded.id).select('-password');

      if (!req.serviceProvider) {
        return res.status(404).json({ message: 'Service provider not found' });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default protectServiceProvider;
