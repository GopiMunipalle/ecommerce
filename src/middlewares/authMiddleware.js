const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const userModel = require('../models/userModel');
const customerModel = require('../models/customerModel');

function verifyToken(token) {
  if (!token) throw new Error('No token provided');
  return jwt.verify(token, JWT_SECRET);
}

function authMiddleware(userTypes = []) {
  return async function (req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ message: 'Unauthorized: No authorization header' });

      const token = authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Unauthorized: Token missing' });

      let decoded;
      try {
        decoded = verifyToken(token);
      } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
      }

      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
      }

      let user;
      if (userTypes.includes('admin')) {
        user = await userModel.findByPk(decoded.id);
      } 
      if (userTypes.includes('customer')) {
        user = await customerModel.findByPk(decoded.id);
      }

      if (!user) return res.status(401).json({ message: 'Unauthorized: User not found' });

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  authMiddleware,
};
