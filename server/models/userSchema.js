const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        default: null, // Google 로그인 시에는 비밀번호가 null일 수 있습니다.
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    region: {
        type: String,
        default: null, // 기본값 설정 또는 구글 로그인 시 추가 정보 입력 필요
    },
    profilePic: {
        type: String,
        default:
            "https://blog.kakaocdn.net/dn/4CElL/btrQw18lZMc/Q0oOxqQNdL6kZp0iSKLbV1/img.png",
    },
    profileMsg: {
        type: String,
        default: "메시지를 입력해 주세요",
    },
    favoriteAuthor: {
        type: String,
        default: null,
    },
    favoriteLibraries: [
        {
            type: Schema.Types.ObjectId,
            ref: "Library",
        },
    ],
    favoriteParks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Park",
        },
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

module.exports = mongoose.model("User", userSchema);
