// routes/adminPanel.js
const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Book = require('../model/bookSchema');
const User = require('../model/userSchema');

// Add new book
router.post('/books', adminAuth, async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all books
router.get('/books', adminAuth, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a book
router.delete('/books/:id', adminAuth, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
