const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  userMessage: { type: String, required: true },
  cardPath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Card', cardSchema);
