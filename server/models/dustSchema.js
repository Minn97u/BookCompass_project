const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DustSchema = new Schema({
    presnatnDt: String,
    frcstOneCn: String,
    frcstTwoCn: String,
    frcstThreeCn: String,
    frcstFourCn: String,
    frcstOneDt: String,
    frcstTwoDt: String,
    frcstThreeDt: String,
    frcstFourDt: String,
});

module.exports = mongoose.model("Dust", DustSchema);
