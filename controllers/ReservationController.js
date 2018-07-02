const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const TokenVerification = require('./TokenVerification');
const Reservation = require('../models/Reservation');
const Copy = require('../models/Copy');

const router = express.Router();

router.use(bodyParser.json());

router.post('/', TokenVerification, (req, res) => {
  if (req.userRole == 'patron') {
    Reservation.create({
      book: req.body.book,
      user: req.userId,
      date: Date.now(),
      isCompleted: false
    }, (err, reservation) => {
      if (err) { res.status(500).send('Server error. Please try again later.'); }
      else if (reservation) {
        Copy.findByIdAndUpdate(
          req.body._id,
          {
            isAvailable: false
          },
          (err, reservation) => {
            if (err) { res.status(500).send('Server error. Please try again later.'); }
            else { res.send(reservation); }
          })
      }
    });
  } else {
    res.status(400);
  }
});

router.get('/user/:id', TokenVerification, (req, res) => {
  if (req.userId == req.params.id || req.userRole == 'admin') {
    Reservation.find({ user: req.params.id }, (err, reservations) => {
      if (err) { res.status(500).send('Server error. Please try again later.'); }
      else { res.send(reservations); }
    });
  } else {
    res.send(401);
  }
});

module.exports = router;