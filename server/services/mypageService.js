const User = require("../models/userSchema");
const Post = require("../models/postSchema");
const Comment = require("../models/commentSchema");
const Review = require("../models/reviewSchema");

async function getUserProfile(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new Error("유저를 찾을 수 없습니다.");
    return user;
}

async function updateUserProfile(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
    });
    if (!user) throw new Error("유저를 찾을 수 없습니다.");
    return user;
}

async function getUserPosts(userId) {
    const posts = await Post.find({ "author.id": userId });
    return posts;
}

async function deleteUserPost(userId, postId) {
    const post = await Post.findOneAndDelete({
        shortId: postId,
        "author.id": userId,
    });
    if (!post) throw new Error("글을 찾을 수 없습니다.");
    return post;
}

async function getUserComments(userId) {
    const comments = await Comment.find({ author: userId }).populate(
        "postId",
        "shortId title isDeleted"
    );
    const filteredComments = comments.filter(
        (comment) => comment.postId && !comment.postId.isDeleted
    );
    const formattedComments = filteredComments.map((comment) => ({
        _id: comment._id,
        content: comment.content,
        date: comment.createdAt,
        postId: comment.postId ? comment.postId.shortId : null,
        postTitle: comment.postId ? comment.postId.title : null,
    }));
    return formattedComments;
}

async function deleteUserComment(userId, commentId) {
    const comment = await Comment.findOneAndDelete({
        _id: commentId,
        author: userId,
    });
    if (!comment) throw new Error("댓글을 찾을 수 없습니다.");
    return comment;
}

async function getUserFavoriteLibraries(userId) {
    const user = await User.findById(userId).populate("favoriteLibraries");
    if (!user) throw new Error("유저를 찾을 수 없습니다.");
    return user.favoriteLibraries;
}

async function getUserFavoriteParks(userId) {
    const user = await User.findById(userId).populate("favoriteParks");
    if (!user) throw new Error("유저를 찾을 수 없습니다.");
    return user.favoriteParks;
}

async function deleteUserFavorite(userId, id, type) {
    const user = await User.findById(userId);
    if (!user) throw new Error("유저를 찾을 수 없습니다.");

    if (type === "library") {
        user.favoriteLibraries = user.favoriteLibraries.filter(
            (libraryId) => libraryId.toString() !== id
        );
    } else if (type === "park") {
        user.favoriteParks = user.favoriteParks.filter(
            (parkId) => parkId.toString() !== id
        );
    } else {
        throw new Error("잘못된 유형입니다.");
    }

    await user.save();
    return user;
}

async function getUserReviews(userId) {
    const reviews = await Review.find({ user: userId })
        .populate("library")
        .populate("park");
    const formattedReviews = reviews.map((review) => ({
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        date: review.createdAt,
        libraryName: review.library ? review.library.name : null,
        parkName: review.park ? review.park.name : null,
    }));
    return formattedReviews;
}

async function deleteUserReview(userId, reviewId) {
    const review = await Review.findOneAndDelete({
        _id: reviewId,
        user: userId,
    });
    if (!review) throw new Error("리뷰를 찾을 수 없습니다.");
    return review;
}

module.exports = {
    getUserProfile,
    updateUserProfile,
    getUserPosts,
    deleteUserPost,
    getUserComments,
    deleteUserComment,
    getUserFavoriteLibraries,
    getUserFavoriteParks,
    deleteUserFavorite,
    getUserReviews,
    deleteUserReview,
};
