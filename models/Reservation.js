const { mongoose } = require('mongoose');
const { Schema } = require('mongoose');

const reservationSchema = Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  patron: {
    type: Schema.Types.ObjectId,
    ref: 'Patron',
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
