const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const reservationSchema = Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('Reservation', reservationSchema);
