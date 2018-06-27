const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const User = require('../models/User');
const Patron = require('../models/Patron');
const TokenVerification = require('./TokenVerification');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/profile', TokenVerification, (req, res) => {
  Patron.findOne({ userRef: req.userId }).populate('userRef', 'name').exec((err, patron) => {
    if(err) { res.status(500).send('Error finding the profile.'); }
    if(!patron) { res.status(500).send('User not found.'); }
    res.send(patron);
  });
});

module.exports = router;

