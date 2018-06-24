const { mongoose } = require('mongoose');
const { Schema } = require('mongoose');

const bookSchema = Schema({
  title: {
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
});

module.exports = mongoose.model('Book', bookSchema);
