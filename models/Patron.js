const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const patronSchema = Schema({
  userRef: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lendings: [{
    type: Schema.Types.ObjectId,
    ref: 'Lendings',
  }],
  reservations: [{
    type: Schema.Types.ObjectId,
    ref: 'Reservations',
  }],
  bookRequests: [{
    type: Schema.Types.ObjectId,
    ref: 'BookRequests',
  }],
});

module.exports = mongoose.model('Patron', patronSchema);
