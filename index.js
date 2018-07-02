const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Database setup
const mongoUsername = process.env.MONGODB_USERNAME;
const mongoPassword = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb://${mongoUsername}:${mongoPassword}@pusthaka-shard-00-00-vamim.mongodb.net:27017,pusthaka-shard-00-01-vamim.mongodb.net:27017,pusthaka-shard-00-02-vamim.mongodb.net:27017/test?ssl=true&replicaSet=pusthaka-shard-0&authSource=admin&retryWrites=true`, { dbName: 'pusthaka' });

const app = express();

app.use(cors());

app.get('/api', (req, res) => {
  res.send('API Working');
  console.log('API working');
});

const AuthController = require('./controllers/AuthController');
const UserController = require('./controllers/UserController');
const PatronController = require('./controllers/PatronController');
const BookController = require('./controllers/BookController');
const LendingController = require('./controllers/LendingController');
const ReservationController = require('./controllers/ReservationController');

app.use('/api/auth', AuthController);
app.use('/api/user', UserController);
app.use('/api/patron', PatronController);
app.use('/api/books', BookController);
app.use('/api/lendings', LendingController);
app.use('/api/reservations', ReservationController);

app.listen(3000, () => console.log('Example app listening on port 3000!'));

