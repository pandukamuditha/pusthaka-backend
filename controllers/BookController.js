const express = require('express');
const bodyParser = require('body-parser');
const TokenVerification = require('./TokenVerification');
const Book = require('../models/Book');
const Copy = require('../models/Copy');

const router = express.Router();

router.use(bodyParser.json());

router.get('/new', TokenVerification, (req, res) => {
  if (req.query.category === 'all') {
    Book.find(null, null, { sort: { _id: -1 }, limit: 20 }).exec((err, books) => {
      if (err) {
        res.status(500).send('Server error. Please try again later.');
      } else {
        res.send(books);
      }
    });
  } else if (req.query.category) {
    Book.find({ category: req.query.category }, null, { sort: { _id: -1 }, limit: 20 })
      .exec((err, books) => {
        if (err || !books) {
          res.status(500).send('Server error. Please try again later.');
        } else {
          res.send(books);
        }
      });
  }
});

router.post('/copy', (req, res) => {
  Copy.create(
    {
      book: req.body.book
    }, (err, copy) => {
      if (err) { res.status(500).send('Server error. Please try again later.'); }
      else { res.send(copy) }
    });
});

router.delete('/copy/:id', (req, res) => {
  Copy.findByIdAndRemove(req.params.id, (err, copy) => {
    if (err) { res.status(500).send('Server error. Please try again later.'); }
    else { res.send(copy) }
  });
});

router.get('/search', TokenVerification, (req, res) => {
  if (req.query.category === 'all') {
    Book.find(
      {
        $or: [
          { title: new RegExp(req.query.query, "i") },
          { author: new RegExp(req.query.query, "i") }
        ]
      }).exec((err, books) => {
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
      }).exec((err, books) => {
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
  Book.findById(req.params.id).exec((err, book) => {
    if (err) { res.status(500).send('Server error. Please try again later.'); }
    else if (!book) { res.status(500).send('Book not found.'); }
    else {
      Copy.find({ book: req.params.id }, (err, copies) => {
        if (err) { res.status(500).send('Server error. Please try again later.'); }
        else {
          res.send({ book: book, copies: copies });
        }
      });
    }
  });
});

module.exports = router;
