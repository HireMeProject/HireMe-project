// models/Card.js
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  cardNumber: {
    type: String,
    required: true,
    trim: true
  },
  expiryDate: {
    type: String,
    required: true,
    trim: true
  },
  cvv: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    enum: ['Visa', 'MasterCard', 'American Express', 'Discover'],
    required: true
  },
//   isDefault: {
//     type: Boolean,
//     default: false
//   },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Card=mongoose.model('Card', cardSchema);
module.exports = {
    Card
}