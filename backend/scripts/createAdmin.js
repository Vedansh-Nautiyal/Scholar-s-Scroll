// scripts/createAdmin.js
const Admin = require('../model/Admin');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Run the script to create the admin
    createAdmin();
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

async function createAdmin() {
  try {
    const admin = new Admin({
      email: "admin@scholarsscroll.com",
      password: "Admin123!",  // Plain text password (it will be hashed)
      role: "Admin",
    });

    await admin.save();
    console.log("Admin user created!");
  } catch (err) {
    console.error("Error creating admin:", err);
  }
}
