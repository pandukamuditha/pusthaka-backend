const { mongoose } = require('mongoose');
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
});

module.exports = mongoose.model('Copy', copySchema);
