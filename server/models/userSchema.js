const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    name: {
        type: String,
        required: true
    }, //둘중하나정리
    // username: {
    //     type: String,
    //     // require: true, 
    //     unique: true 
    // },
    password: {
        type: String,
        default: null // Google 로그인 시에는 비밀번호가 null일 수 있습니다.
        },
    email: {
        type: String,
        require: true,
        unique: true 
        },
    region: {
        type: String,
        default: null // 기본값 설정 또는 구글 로그인 시 추가 정보 입력 필요
    },
    // profile: { 
    //     name: String, 
    //     comments: String, 
    //     pictureUrl: String 
    // }, //둘중하나 정리
    profilePic: {
        type: String,
        default: 'https://blog.kakaocdn.net/dn/4CElL/btrQw18lZMc/Q0oOxqQNdL6kZp0iSKLbV1/img.png',
      },
    profileMsg: {
        type: String,
        default: '메시지를 입력해 주세요'
    },
    favoriteAuthor: { // 추가된 필드
        type: String,
        default: null
    },
    favoriteLibraries: [{ 
        type: Schema.Types.ObjectId,
        ref: "Library" 
        }],
    reviews: [{
        type: Schema.Types.ObjectId, 
        ref: "Review"
        }],
});

module.exports = mongoose.model("User", userSchema);
