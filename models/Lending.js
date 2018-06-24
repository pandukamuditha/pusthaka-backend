const { mongoose } = require('mongoose');
const { Schema } = require('mongoose');

const lendingSchema = Schema({
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
  patron: [{
    type: Schema.Types.ObjectId,
    ref: 'Patron',
  }],
});

module.exports = mongoose.model('Lending', lendingSchema);
