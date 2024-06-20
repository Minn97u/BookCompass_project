const Post = require("../models/postSchema");
const Comment = require("../models/commentSchema");

async function createPost(data, userId) {
    const { title, content, tag, postImg } = data;
    if (!title || !content) {
        throw new Error("Title and content are required");
    }

    const newPost = new Post({
        title,
        content,
        tag,
        author: {
            id: userId,
            name: data.name,
            profilePic: data.profilePic,
            favoriteAuthor: data.favoriteAuthor,
            profileMsg: data.profileMsg,
        },
        postImg: postImg ? postImg.path : null,
    });
    const savedPost = await newPost.save();
    return savedPost;
}

async function getPosts(query) {
    const { page = 1, limit = 10, tag } = query;
    const filter = tag ? { tag } : {};

    const posts = await Post.find(filter)
        .populate("author", "name profilePic")
        .sort({ createdAt: -1 })
        .select("shortId title tag author postImg createdAt updatedAt")
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    const transformedPosts = posts.map((post) => ({
        shortId: post.shortId,
        title: post.title,
        tag: post.tag,
        author: {
            name: post.author.name,
            profilePic: post.author.profilePic,
        },
        postImg: post.postImg,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
    }));

    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);

    return {
        currentPage: page,
        totalPages,
        posts: transformedPosts,
    };
}

async function getPostById(shortId) {
    const post = await Post.findOne({ shortId })
        .populate({
            path: "author.id",
            select: "name profilePic profileMsg favoriteAuthor",
        })
        .populate({
            path: "comments",
            populate: {
                path: "author",
                select: "name profilePic profileMsg favoriteAuthor",
            },
        })
        .lean();

    if (!post) throw new Error("Post not found");

    const detailedPost = {
        shortId: post.shortId,
        title: post.title,
        content: post.content,
        tag: post.tag,
        author: {
            name: post.author.name,
            profilePic: post.author.profilePic,
            profileMsg: post.author.profileMsg,
            favoriteAuthor: post.author.favoriteAuthor,
        },
        postImg: post.postImg,
        comments: post.comments.map((comment) => ({
            _id: comment._id,
            author: {
                name: comment.author.name,
                profilePic: comment.author.profilePic,
                profileMsg: comment.author.profileMsg,
                favoriteAuthor: comment.author.favoriteAuthor,
            },
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        })),
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
    };

    return detailedPost;
}

async function updatePost(shortId, data, userId) {
    const { title, content, tag, postImg } = data;
    if (!title || !content) {
        throw new Error("Title and content are required");
    }

    const post = await Post.findOne({ shortId });
    if (!post) throw new Error("Post not found");
    if (post.author.id.toString() !== userId.toString()) {
        throw new Error("You are not authorized to edit this post");
    }

    post.title = title;
    post.content = content;
    post.tag = tag;
    post.postImg = postImg ? postImg.path : post.postImg;
    post.updatedAt = Date.now();

    const updatedPost = await post.save();
    return updatedPost;
}

async function deletePost(shortId, userId) {
    const post = await Post.findOne({ shortId });
    if (!post) throw new Error("Post not found");
    if (post.author.id.toString() !== userId.toString()) {
        throw new Error("You are not authorized to delete this post");
    }

    await Post.deleteOne({ shortId });
    return post;
}

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
};
