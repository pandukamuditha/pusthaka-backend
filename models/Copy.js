const mongoose= require('mongoose');
const { Schema } = require('mongoose');

const copySchema = Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: true
  }
}, { collection: 'copies' });

module.exports = mongoose.model('Copy', copySchema, 'copies');
