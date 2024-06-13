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
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        postImg: {
            type: String,
            default: null,
        },
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Post", PostSchema);
