const express = require('express');
const bodyParser = require('body-parser');
const TokenVerification = require('./TokenVerification');

const Lending = require('../models/Lending');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/', TokenVerification, (req, res) => {
    Lending.create({
        
    })
});

module.exports = router;