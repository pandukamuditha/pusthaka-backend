const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const bookSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  isbn: {
    type: Number,
    required: true,
  },
  copies: [{
    type: Schema.Types.ObjectId,
    ref: 'Copy',
  }]
});

module.exports = mongoose.model('Book', bookSchema);
