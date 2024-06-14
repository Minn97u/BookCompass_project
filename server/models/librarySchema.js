const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// mongoose 라이브러리에선 Number 타입이 소수점 숫자까지 포함하기 때문에 type을 굳이 float으로 바꿀 필요는 없음
const librarySchema = new Schema({
    name: { type: String, required: true },
    district: String,
    address: String,
    phone: String,
    url: String,
    hours: String,
    holidays: String,
    latitude: Number,
    longitude: Number,
    averageRating: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

module.exports = mongoose.model("Library", librarySchema);
