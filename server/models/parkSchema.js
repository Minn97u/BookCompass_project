const mongoose = require('mongoose');

const parkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  district: { type: String, required: true },
  address: { type: String, required: true },
  managing_department: { type: String, required: true },
  phone: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  averageRating: { type: Number, default: 0 },
});

const Park = mongoose.model('Park', parkSchema);

module.exports = Park;
