const express = require('express');
const bodyParser = require('body-parser');
const TokenVerification = require('./TokenVerification');

const Lending = require('../models/Lending');
const Reservation = require('../models/Reservation');
const Copy = require('../models/Copy');

const router = express.Router();

router.use(bodyParser.json());

router.post('/', TokenVerification, (req, res) => {
  if (req.userRole == 'admin') {
    Lending.find({
      user: req.body.user,
      receivedDate: null
    }).populate('copy').exec((err, lendings) => {

      // Check maximum number of books to lend
      if (lendings.length == 2) {
        res.status(500).send('Maximum lendings reached.')
      }

      // Check overdue lendings
      else if (lendings.length == 0 || (((lendings[0].issuedDate.getTime() + 604800000) > Date.now()) && (lendings[0].copy.book != req.body.book))) {

        // Check if the lending comes from a reservation
        Reservation.count(
          {
            book: req.body.book,
            user: req.body.user
          },
          (err, reservationCount) => {
            if (err) { res.status(500).send('Server error. Please try again later.'); }
            else if (reservationCount > 0) {

              // If a reservation is found, it is removed and lending is added
              Reservation.findOneAndRemove(
                {
                  book: req.body.book,
                  user: req.body.user
                }, (err, reservation) => {
                  if (err) { res.status(500).send('Server error. Please try again later.'); }
                  else if (!reservation) { res.status(500).send('Not reserved.'); }
                  else if (reservation) {

                    // Creating the lending entry with data from reservation
                    Lending.create({
                      copy: req.body.copy,
                      issuedDate: reservation.createdAt,
                      user: req.body.user
                    }, (err, lending) => {
                      if (err) { res.status(500).send('Server error. Please try again later.'); }
                      else if (!lending) { res.status(500).send('Not reserved.'); }
                      else if (lending) {

                        // Making the copy not available
                        Copy.findByIdAndUpdate(req.body.copy, { isAvailable: false }, (err, copy) => {
                          if (err) { res.status(500).send('Server error. Please try again later.'); }
                          else if (copy) { res.send(lending); }
                        });
                      }
                    });
                  }
                });
              // When the book is not reserved before lent
            } else {
              Copy.count(
                {
                  book: req.body.book,
                  isAvailable: true
                },
                (err, copyCount) => {
                  if (err) { res.status(500).send('Server error. Please try again later.'); }
                  else {
                    Reservation.count(
                      {
                        book: req.body.book,
                        createdAt: {
                          $gt: Date.now() - 86400000
                        }
                      },
                      (err, reservationCount) => {
                        if (err) { res.status(500).send('Server error. Please try again later.'); }
                        else {
                          if ((copyCount - reservationCount) > 0) {
                            Lending.create(
                              {
                                copy: req.body.copy,
                                issuedDate: Date.now(),
                                user: req.body.user
                              },
                              (err, lending) => {
                                if (err) { res.status(500).send('Server error. Please try again later.'); }
                                else if (!lending) { res.status(500).send('Not reserved.'); }
                                else if (lending) {

                                  // Making the copy not available
                                  Copy.findByIdAndUpdate(req.body.copy, { isAvailable: false }, (err, copy) => {
                                    if (err) { res.status(500).send('Server error. Please try again later.'); }
                                    else if (copy) { res.send(lending); }
                                  });
                                }
                              });
                          } else {
                            res.status(500).send('Book is reserved.');
                          }
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      } else {
        res.status(500).send('Error. Check due books and lendings for the user.')
      }
    })
  } else {
    res.status(401);
  }
});

router.put('/', TokenVerification, (req, res) => {
  Lending
});

router.get('/user/:id', TokenVerification, (req, res) => {
  if (req.query.type == 'due') {

  } else if (req.query.type == 'intime') {

  } else {
    Lending.find(
      {
        user: req.params.id
      }
    ).populate(
      {
        path: 'copy',
        populate: {
          path: 'book'
        }
      }
    ).exec((err, lending) => {
      if (err) { res.status(500).send('Server error. Please try again later.'); }
      else if (!lending) { res.status(500).send('No books.'); }
      else if (lending) { res.send(lending); }
    });
  }
});

router.get('/all', TokenVerification, (req, res) => {
  if (req.query.type == 'overdue') {
    Lending.find(
      {
        issuedDate: {
          $lt: Date.now() - 604800000
        }
      }
    ).populate(
      {
        path: 'copy',
        populate: {
          path: 'book'
        }
      }
    ).populate('user').exec((err, lending) => {
      if (err) { res.status(500).send('Server error. Please try again later.'); }
      else if (!lending) { res.status(500).send('No books.'); }
      else if (lending) { res.send(lending); }
    });
  } else if (req.query.type == 'intime') {
    Lending.find(
      {
        issuedDate: {
          $gt: Date.now() - 604800000
        }
      }
    ).populate(
      {
        path: 'copy',
        populate: {
          path: 'book'
        }
      }
    ).populate('user').exec((err, lending) => {
      if (err) { res.status(500).send('Server error. Please try again later.'); }
      else if (!lending) { res.status(500).send('No books.'); }
      else if (lending) { res.send(lending); }
    });
  } else {
    Lending.find().populate(
      {
        path: 'copy',
        populate: {
          path: 'book'
        }
      }
    ).populate('user').exec((err, lending) => {
      if (err) { res.status(500).send('Server error. Please try again later.'); }
      else if (!lending) { res.status(500).send('No books.'); }
      else if (lending) { res.send(lending); }
    });
  }
});

module.exports = router;