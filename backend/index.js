const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Initialize the app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON request bodies
app.use(express.json());

// Configure CORS (allow all origins for development, in production specify allowed origins)
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',  // Use an environment variable for production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Require the database connection
require('./db');  // Ensure DB connection logic is set in './db'

// Import routes
const bookRoute = require("./routes/bookroutes");
const authRoute = require("./routes/authroutes");
const adminAuthRoute = require("./routes/adminAuth");
const adminPanelRoute = require("./routes/adminPanel");

// Register routes
app.use('/api/admin/auth', adminAuthRoute);      // Admin authentication route
app.use('/api/admin/panel', adminPanelRoute);     // Admin panel route
app.use("/api/admin/books", bookRoute);           // Admin route for books (including categories)
app.use("/api/auth", authRoute);                  // Auth route
app.use('/uploads', express.static('uploads'));   // Static files route for file uploads

// Specific log for PDF route to check if it's connected
app.use('/api/pdf/:id', (req, res, next) => {
  console.log(`PDF route accessed with ID: ${req.params.id}`);
  next(); // Proceed to the actual handler for the route
});

// Catch-all for undefined routes - should be at the end of all route definitions
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware for unexpected errors
app.use((err, req, res, next) => {
  console.error('Unexpected Error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Set the port dynamically based on environment variable or fallback to 5001
const port = process.env.PORT || 5001;  // Default port to 5001 if not specified in the .env file

// Start the server and log the port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
