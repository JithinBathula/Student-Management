// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: 'Authorization header missing' });
  
  const token = authHeader.split(' ')[1];
  if (!token)
    return res.status(401).json({ message: 'Token missing' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: 'Invalid token' });
    
    req.user = user;
    next();
  });
};
