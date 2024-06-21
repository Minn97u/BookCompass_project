const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortId = require("./types/short-id");

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
            id: { type: Schema.Types.ObjectId, ref: "User", required: true },
            name: { type: String, required: true },
            profilePic: { type: String, required: false },
            favoriteAuthor: { type: String, default: null },
            profileMsg: { type: String, default: "메시지를 입력해 주세요" },
        },
        postImg: {
            type: String,
            default: null,
        },
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Post", PostSchema);
