const mongoose= require('mongoose');
const { Schema } = require('mongoose');

const copySchema = Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  lendings: [{
    type: Schema.Types.ObjectId,
    ref: 'Lending',
  }],
  isAvailable: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('Copy', copySchema, 'copies');
