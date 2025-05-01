// middleware/adminAuth.js

const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');

const adminAuth = async (req, res, next) => {
  // Get token from authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify the token and get user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    // Check if the user is an admin
    const user = await User.findById(req.user.id);
    if (user && user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    next();  // Allow the request to proceed
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = adminAuth;
