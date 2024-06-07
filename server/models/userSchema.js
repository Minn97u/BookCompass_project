// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     username: { type: String, require: true, unique: true },
//     password: { type: String },
//     email: { type: String, require: true, unique: true },
//     profile: { name: String, comments: String, pictureUrl: String },
//     favoriteLibraries: [{ type: Schema.Types.ObjectId, ref: "Library" }],
//     reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
// });

// module.exports = mongoose.model("User", userSchema);
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: null // Google 로그인 시에는 비밀번호가 null일 수 있습니다.
    },
    region: {
        type: String,
        default: null // 기본값 설정 또는 구글 로그인 시 추가 정보 입력 필요
    },
    profileMsg: {
        type: String,
        default: '메시지를 입력해 주세요'
    },
    favoriteAuthor: { // 추가된 필드
        type: String,
        default: null
    }
}, { timestamps: true }); // 타임스탬프 추가


const User = mongoose.model('User', UserSchema);
module.exports = User;
