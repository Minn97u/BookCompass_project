const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 리뷰 스키마 정의: 사용자, 도서관, 평점, 코멘트를 포함
const reviewSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        library: {
            type: Schema.Types.ObjectId,
            ref: "Library",
            required: true,
        },
        rating: { type: Number, required: true },
        comment: String,
    },
    {
        timestamps: true, // 생성 및 수정 시간 자동 추가
    }
);

module.exports = mongoose.model("Review", reviewSchema);
