const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminAuth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer')) {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return res.status(403).json({ message: 'Access denied: Admin rights required' });
      }

      req.admin = admin;
      next();
    } else {
      res.status(401).json({ message: 'No token provided' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
};

module.exports = adminAuth;