const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const User = require('../models/User');
const Patron = require('../models/Patron');
const TokenVerification = require('./TokenVerification');

const router = express.Router();

router.use(bodyParser.json());

router.post('/patron', TokenVerification, (req, res) => {
  if (req.userRole == 'admin') {
    User.create({
      name: req.body.name,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password),
      role: 'patron',
    }, (err, user) => {
      if (err) { res.status(500).send('Error Adding User'); }
      if (user) {
        Patron.create({
          userRef: user._id,
        }, (err, patron) => {
          if (err) { res.status(500).send('Error Adding User'); }
          if (patron) { res.status(200).send('User Added'); }
        });
      }
    });
  } else {
    res.status(401);
  }
});

router.post('/admin', (req, res) => {
  if (req.userRole == 'admin') {
    User.create({
      name: req.body.name,
      username: req.body.name,
      password: bcrypt.hashSync(req.body.username),
      role: 'admin',
    }, (err, user) => {
      if (err) { res.status(500).send('Error Adding User'); }
      if (user) { res.status(200).send('User Added'); }
    });
  } else {
    res.status(401);
  }
});

router.delete('/patron', (req, res) => {
  if (req.userRole == 'admin') {
    const patronId = req.body.patron_id;
    let userId;

    Patron.findById(patronId, (err, patron) => {
      if (err) { res.status(500).send('Not found'); }
      if (patron) {
        userId = patron.userRef;
        User.findByIdAndRemove(userId, (err) => {
          if (err) { res.status(500).send('Error Deleting Patron'); }
          else {
            Patron.findByIdAndRemove(patronId, (err) => {
              if (err) { res.status(500).send('Error Deleting Patron'); }
              else { res.status(200).send('Success'); }
            });
          }
        });
      }
    });
  } else {
    res.status(401);
  }
});

module.exports = router;
