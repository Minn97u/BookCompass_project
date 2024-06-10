const mongoose = require("mongoose");
const { Schema } = mongoose;
const shortId = require("./types/short-id");
const CommentSchema = require("./commentSchema"); // 댓글 스키마 추가

const PostSchema = new Schema(
    {
        shortId,
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        tag: {
            type: String,
            default: "free",
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        postImg: {
            type: String,
            default: null,
        },
        comments: [CommentSchema], // 댓글 스키마를 서브 스키마로 추가
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
