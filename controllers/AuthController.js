const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// For parsing body to json
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    // Password check
    const isPasswordMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordMatch) return res.status(401).send({ auth: false, token: null });

    // Creating JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SALT, {
      expiresIn: 86400, // expires in 24 hours
    });

    // Sending the token
    res.status(200).send({ auth: true, token, expiresIn: 86400, role: user.role });
  });
});



module.exports = router;
