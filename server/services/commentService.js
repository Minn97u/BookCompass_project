const Post = require("../models/postSchema");
const Comment = require("../models/commentSchema");

async function createComment(postId, userId, content) {
    if (!content) throw new Error("Content is required");

    const post = await Post.findOne({ shortId: postId });
    if (!post || post.isDeleted) throw new Error("Post not found");

    const newComment = new Comment({
        author: userId,
        content,
        postId: post._id,
    });

    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();

    return newComment;
}

async function getComments(postId) {
    const post = await Post.findOne({ shortId: postId }).populate(
        "comments.author",
        "name profilePic"
    );
    if (!post || post.isDeleted) throw new Error("Post not found");

    return post.comments;
}

async function updateComment(postId, commentId, userId, content) {
    if (!content) throw new Error("Content is required");

    const post = await Post.findOne({ shortId: postId });
    if (!post || post.isDeleted) throw new Error("Post not found");

    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.author.toString() !== userId.toString())
        throw new Error("You are not authorized to edit this comment");

    comment.content = content;
    comment.updatedAt = Date.now();
    await comment.save();

    return comment;
}

async function deleteComment(postId, commentId, userId) {
    const post = await Post.findOne({ shortId: postId });
    if (!post || post.isDeleted) throw new Error("Post not found");

    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.author.toString() !== userId.toString())
        throw new Error("You are not authorized to delete this comment");

    await Comment.deleteOne({ _id: commentId });
    post.comments.pull(commentId);
    await post.save();

    return comment;
}

module.exports = {
    createComment,
    getComments,
    updateComment,
    deleteComment,
};
