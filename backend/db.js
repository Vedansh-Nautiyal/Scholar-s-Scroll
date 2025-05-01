const mongoose = require('mongoose');
require('dotenv').config();

// Retrieve the MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

console.log("MONGO_URI:", MONGO_URI);  // Log the URI to verify it's correct

// Ensure MONGO_URI exists in the environment variables
if (!MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in environment variables');
  process.exit(1);  // Exit if MONGO_URI is not found
}

// Connect to MongoDB without deprecated options
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to the database');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err.message);
    process.exit(1);  // Exit the application if the database connection fails
  });
