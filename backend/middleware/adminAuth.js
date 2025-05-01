const jwt = require('jsonwebtoken');
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Log JWT secret for debugging

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  console.log('Token received:', token); // Log the token for debugging

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded.id;
    next();
  } catch (err) {
    console.error('Token verification failed:', err); // Log any error in token verification
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
