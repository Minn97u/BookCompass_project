const commentService = require("../services/commentService");

async function createComment(req, res) {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        const comment = await commentService.createComment(
            postId,
            userId,
            content
        );
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
}

async function getComments(req, res) {
    try {
        const { postId } = req.params;

        const comments = await commentService.getComments(postId);
        res.status(200).json(comments);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
}

async function updateComment(req, res) {
    try {
        const { postId, commentId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        const comment = await commentService.updateComment(
            postId,
            commentId,
            userId,
            content
        );
        res.status(200).json(comment);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
}

async function deleteComment(req, res) {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user._id;

        await commentService.deleteComment(postId, commentId, userId);
        res.status(200).json({ msg: "Comment deleted successfully" });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
}

module.exports = {
    createComment,
    getComments,
    updateComment,
    deleteComment,
};
