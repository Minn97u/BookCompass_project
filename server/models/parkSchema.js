const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const parkSchema = new Schema({
    name: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String, required: true },
    managing_department: { type: String, required: true },
    phone: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    averageRating: { type: Number, default: 0 },
});

module.exports = mongoose.model("Park", parkSchema);
