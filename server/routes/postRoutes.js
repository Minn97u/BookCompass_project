/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management endpoints
 */
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { ensureAuthenticated } = require("../middlewares/checklogin");
const upload = require("../middlewares/upload");
const commentRoutes = require("./commentRoutes");

// 게시글 생성
/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tag:
 *                 type: string
 *               postImg:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Title and content are required
 *       500:
 *         description: Server error
 */
router.post(
    "/",
    ensureAuthenticated,
    upload.single("postImg"),
    postController.createPost
);

// 게시글 목록 불러오기
/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get a list of posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of posts per page
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Tag name
 *     responses:
 *       200:
 *         description: A list of posts
 *       500:
 *         description: Server error
 */
router.get("/", postController.getPosts);

// 게시물 상세 정보 불러오기
/**
 * @swagger
 * /api/posts/{shortId}:
 *   get:
 *     summary: Get post details
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: shortId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to get
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get("/:shortId", postController.getPostById);

// 게시글 수정
/**
 * @swagger
 * /api/posts/{shortId}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: shortId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tag:
 *                 type: string
 *               postImg:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Title and content are required
 *       403:
 *         description: Not authorized to edit this post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put(
    "/:shortId",
    ensureAuthenticated,
    upload.single("postImg"),
    postController.updatePost
);

// 게시글 삭제
/**
 * @swagger
 * /api/posts/{shortId}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: shortId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       403:
 *         description: Not authorized to delete this post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.delete("/:shortId", ensureAuthenticated, postController.deletePost);

// 댓글 라우트 포함
router.use("/:postId/comments", commentRoutes);

module.exports = router;
