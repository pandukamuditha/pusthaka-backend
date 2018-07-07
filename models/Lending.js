const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const lendingSchema = Schema({
  copy: {
    type: Schema.Types.ObjectId,
    ref: 'Copy',
    required: true
  },
  issuedDate: {
    type: Date,
    required: true,
  },
  receivedDate: {
    type: Date,
  },
  fine: {
    type: Number,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

module.exports = mongoose.model('Lending', lendingSchema);
