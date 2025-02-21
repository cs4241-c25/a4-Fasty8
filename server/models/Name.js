const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: String,
  number: Number,
  food: String
}, {
  collection: 'cars' 
});

module.exports = mongoose.model('Car', carSchema);
