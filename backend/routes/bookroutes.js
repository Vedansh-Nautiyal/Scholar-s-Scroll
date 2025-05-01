const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const Book = require('../model/bookSchema');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');

// Predefined categories for books (hardcoded list)
const categories = [
  "Computer Science",
  "Geology",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Chemical Engineering"
];

// Ensure the uploads directory exists; create it if not
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up file upload destination and naming convention using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uuid = require('uuid');
    cb(null, `${uuid.v4()}-${Date.now()}-${file.originalname}`);
  }
});

// Multer setup with file type and size validation
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only PDF, JPG, PNG are allowed.'));
    }
    cb(null, true);
  }
});

// JWT Middleware for Admin Auth
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please login again' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

// POST route for creating a new book (Admin only)
router.post('/create', adminAuth, upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
  const { title, author, description, category } = req.body;

  if (!title || !author || !description || !category) {
    return res.status(400).json({ message: 'Title, author, description, and category are required.' });
  }

  const pdf = req.files['pdf'] ? req.files['pdf'][0].path : null;
  if (!pdf) {
    return res.status(400).json({ message: 'PDF file is required.' });
  }

  const image = req.files['image'] ? req.files['image'][0].path : null;

  const newBook = new Book({
    title,
    author,
    description,
    image,
    pdf,
    category
  });

  try {
    await newBook.save();
    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET route to fetch all books
router.get('/all', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET route to fetch a book by its ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE route for deleting a book by its ID
router.delete('/:id', adminAuth, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }

  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve static files from the 'uploads' directory
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// GET route to fetch all books
router.get('/all', async (req, res) => {
  try {
    const books = await Book.find();
    // Return book data excluding the PDF content (for security reasons)
    const booksWithPdfInfo = books.map(book => ({
      _id: book._id,
      title: book.title,
      author: book.author,
      image: book.image,
      // Don't include the PDF content, just metadata
    }));

    res.status(200).json(booksWithPdfInfo);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET route to fetch a book's PDF content by ID
router.get('/pdf/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }

  try {
    const book = await Book.findById(id);
console.log(book)
    if (!book || !book.pdf) {
      return res.status(404).json({ message: 'PDF not found for this book' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(path.join(__dirname,'..', book.pdf));  // Send the binary PDF content as response
  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).json({ message: 'Server error while fetching PDF' });
  }
});

module.exports = router;
