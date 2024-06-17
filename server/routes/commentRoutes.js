const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/postSchema");
const Comment = require("../models/commentSchema");
const { ensureAuthenticated } = require("../middlewares/checklogin");

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment endpoints
 */

// 댓글 생성
/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Content is required
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.post("/", ensureAuthenticated, async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ msg: "Content is required" });
    }

    try {
        const post = await Post.findOne({ shortId: postId });

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        const newComment = new Comment({
            author: req.user._id,
            content: content,
            postId: post._id,
        });
        await newComment.save();
        post.comments.push(newComment._id);
        await post.save();

        res.status(201).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

// 댓글 목록 불러오기
/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to get comments for
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   author:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findOne({ shortId: postId }).populate(
            "comments.author",
            "name profilePic"
        );

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        res.status(200).json(post.comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

// 댓글 수정
/**
 * @swagger
 * /api/posts/{postId}/comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post containing the comment
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Content is required
 *       403:
 *         description: Not authorized to edit this comment
 *       404:
 *         description: Post or comment not found
 *       500:
 *         description: Server error
 */
router.put("/:commentId", ensureAuthenticated, async (req, res) => {
    const { postId, commentId } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ msg: "Content is required" });
    }

    try {
        const post = await Post.findOne({ shortId: postId });

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" });
        }

        // 작성자와 현재 로그인한 사용자가 동일한지 확인
        if (comment.author.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json({ msg: "You are not authorized to edit this comment" });
        }

        comment.content = content;
        comment.updatedAt = Date.now(); // 수정한 시간 기록

        await comment.save();
        res.status(200).json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

// 댓글 삭제
/**
 * @swagger
 * /api/posts/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post containing the comment
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Not authorized to delete this comment
 *       404:
 *         description: Post or comment not found
 *       500:
 *         description: Server error
 */
router.delete("/:commentId", ensureAuthenticated, async (req, res) => {
    const { postId, commentId } = req.params;

    try {
        const post = await Post.findOne({ shortId: postId });
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" });
        }

        // 작성자와 현재 로그인한 사용자가 동일한지 확인
        if (comment.author.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json({ msg: "You are not authorized to delete this comment" });
        }

        // 댓글 삭제
        await Comment.deleteOne({ _id: commentId });
        post.comments.pull(commentId);
        await post.save();

        res.status(200).json({ msg: "Comment deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
