const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const sendMail = require("../utils/sendmail");
const revokeToken = require("../utils/revokeToken");
const Post = require("../models/postSchema");
const Comment = require("../models/commentSchema");
const Review = require("../models/reviewSchema");

async function register({ name, email, password, region, favoriteAuthor }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("해당 이메일로 가입한 회원이 이미 존재합니다");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        region,
        favoriteAuthor,
    });

    await newUser.save();
    return newUser;
}

async function resetPassword(email) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("해당 이메일로 가입한 유저를 찾을 수 없습니다");

    if (user.password === null) throw new Error("소셜로그인을 진행해 주세요");

    const newPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    await sendMail(
        user.email,
        "Password Reset",
        `Your new password is: ${newPassword}`
    );

    return user;
}

async function changePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId);
    if (!user) throw new Error("유저를 찾을 수 없습니다");

    if (user.password === null)
        throw new Error("소셜회원은 비밀번호를 변경할 수 없습니다");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("기존 비밀번호를 확인해 주세요");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return user;
}

async function deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("유저가 없습니다.");

    user.isDeleted = true;
    if (user.googleId) {
        if (user.googleAccessToken) {
            await revokeToken(user.googleAccessToken);
            user.googleId = undefined;
            user.googleAccessToken = undefined;
        }
    }

    await user.save();
    await Post.updateMany({ "author.id": user._id }, { isDeleted: true });
    await Comment.updateMany({ author: user._id }, { isDeleted: true });
    await Review.updateMany({ user: user._id }, { isDeleted: true });

    const userPosts = await Post.find({ "author.id": user._id });
    const postIds = userPosts.map((post) => post._id);
    await Comment.updateMany({ postId: { $in: postIds } }, { isDeleted: true });

    return user;
}

module.exports = {
    register,
    resetPassword,
    changePassword,
    deleteUser,
};
