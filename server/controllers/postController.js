const postService = require("../services/postService");
const { ensureAuthenticated } = require("../middlewares/checklogin");
const upload = require("../middlewares/upload");

async function createPost(req, res) {
    try {
        const userId = req.user._id;
        const post = await postService.createPost(req.body, userId);
        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
}

async function getPosts(req, res) {
    try {
        const posts = await postService.getPosts(req.query);
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

async function getPostById(req, res) {
    try {
        const post = await postService.getPostById(req.params.shortId);
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
}

async function updatePost(req, res) {
    try {
        const post = await postService.updatePost(
            req.params.shortId,
            req.body,
            req.user._id
        );
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
}

async function deletePost(req, res) {
    try {
        await postService.deletePost(req.params.shortId, req.user._id);
        res.status(200).json({ msg: "Post deleted successfully" });
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
}

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
};
