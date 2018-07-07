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
    }, (err, reservation) => {
      if (err) { res.status(500).send('Server error. Please try again later.'); }
      else if (reservation) {
        res.send(reservation);
      }
    });
  } else {
    res.status(400);
  }
});

router.delete('/:id', TokenVerification, (req, res) => {
  if (req.userRole == 'patron') {
    Reservation.findByIdAndRemove(req.params.id, (err, result) => {
      if (err) { res.status(500).send('Server error. Please try again later.'); }
      else if (result) {
        res.send(result);
      }
    });
  } else {
    res.status(400);
  }
});

router.get('/user/:id/:type', TokenVerification, (req, res) => {

  if (req.userId == req.params.id || req.userRole == 'admin') {

    if (req.params.type == 'all') {
      Reservation.find({
        user: req.params.id
      }).populate('book').exec((err, reservations) => {
        if (err) { res.status(500).send('Server error. Please try again later.'); }
        else { res.send(reservations); }
      });
    } else if (req.params.type == 'valid') {
      Reservation.find(
        {
          user: req.params.id,
          createdAt: {
            $gt: Date.now() - 86400000
          }
        }).populate('book').exec((err, reservations) => {
          if (err) { res.status(500).send('Server error. Please try again later.'); }
          else { res.send(reservations); }
        });
    }

  } else {
    res.send(401);
  }

});


router.get('/book/:id/:type', TokenVerification, (req, res) => {

  if (req.params.type == 'all') {
    Reservation.find({
      book: req.params.id
    }, (err, reservations) => {
      if (err) { res.status(500).send('Server error. Please try again later.'); }
      else { res.send(reservations); }
    });
  } else if (req.params.type == 'valid') {
    Reservation.find(
      {
        book: req.params.id,
        createdAt: {
          $gt: Date.now() - 86400000
        }
      }, (err, reservations) => {
        if (err) { res.status(500).send('Server error. Please try again later.'); }
        else { res.send(reservations); }
      });
  }

});


router.get('/book/:id/:type', TokenVerification, (req, res) => {

  if (req.params.type == 'all') {
    Reservation.find({
      book: req.params.id
    }, (err, reservations) => {
      if (err) { res.status(500).send('Server error. Please try again later.'); }
      else { res.send(reservations); }
    });
  } else if (req.params.type == 'valid') {
    Reservation.find(
      {
        book: req.params.id,
        createdAt: {
          $gt: Date.now() - 86400000
        }
      }, (err, reservations) => {
        if (err) { res.status(500).send('Server error. Please try again later.'); }
        else { res.send(reservations); }
      });
  }

});

router.get('/:type', TokenVerification, (req, res) => {

  if (req.userRole == 'admin') {

    if (req.params.type == 'all') {
      Reservation.find({
      }).populate('user')
        .populate('book').exec((err, reservations) => {
          if (err) { res.status(500).send('Server error. Please try again later.'); }
          else { res.send(reservations); }
        });
    } else if (req.params.type == 'valid') {
      Reservation.find(
        {
          createdAt: {
            $gt: Date.now() - 86400000
          }
        }, (err, reservations) => {
          if (err) { res.status(500).send('Server error. Please try again later.'); }
          else { res.send(reservations); }
        });
    }

  } else {
    res.sendStatus(401);
  }

});


module.exports = router;