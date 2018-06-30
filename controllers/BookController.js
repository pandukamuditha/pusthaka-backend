const express = require('express');
const bodyParser = require('body-parser');
const TokenVerification = require('./TokenVerification');
const Book = require('../models/Book');
const Copy = require('../models/Copy');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/new', TokenVerification, (req, res) => {
  if (req.query.category === 'all') {
    Book.find(null, null, { sort: { _id: -1 }, limit: 20 }).populate('copies').exec((err, books) => {
      if (err) {
        res.status(500).send('Server error. Please try again later.');
      } else {
        res.send(books);
      }
    });
  } else if (req.query.category) {
    Book.find({ category: req.query.category }, null, { sort: { _id: -1 }, limit: 20 })
      .populate('copies').exec((err, books) => {
        if (err || !books) {
          res.status(500).send('Server error. Please try again later.');
        } else {
          res.send(books);
        }
      });
  }
});

router.get('/search', TokenVerification, (req, res) => {
  if (req.query.category === 'all') {
    Book.find(
      {
        $or: [
          { title: new RegExp(req.query.query, "i") },
          { author: new RegExp(req.query.query, "i") }
        ]
      }).populate('copies').exec((err, books) => {
        if (err) {
          res.status(500).send('Server error. Please try again later.');
        } else if (books.length == 0) {
          res.status(500).send('No books found.');
        } else if (books) {
          res.send(books);
        }
      });
  } else {
    Book.find(
      {
        $and: [
          {
            $or: [
              { title: new RegExp(req.query.query, "i") },
              { author: new RegExp(req.query.query, "i") }
            ]
          },
          { category: req.query.category }]
      }).populate('copies').exec((err, books) => {
        if (err) {
          res.status(500).send('Server error. Please try again later.');
        } else if (books.length == 0) {
          res.status(500).send('No books found.');
        } else if (books) {
          res.send(books);
        }
      });
  }
});

router.get('/:id', TokenVerification, (req, res) => {
  Book.findById(req.params.id).populate('copies').exec((err, book) => {
    if (err) { res.status(500).send('Server error. Please try again later.'); }
    else if (!book) { res.status(500).send('Book not found.'); }
    else {
      res.send(book);
    }
  });
});

module.exports = router;
