const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DustSchema = new Schema({
    dataTime: String,
    pm10Value: String,
    khaiGrade: String,
});

module.exports = mongoose.model("Dust", DustSchema);
