const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const reservationSchema = new Schema({
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
}, {
  timestamps: {
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);
