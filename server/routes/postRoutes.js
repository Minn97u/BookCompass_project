const express = require("express");
const router = express.Router();
const Post = require("../models/postSchema");
const User = require("../models/userSchema"); // User 모델 가져오기
const commentRoutes = require("./commentRoutes"); // 댓글 라우트 추가
const { ensureAuthenticated } = require("../middlewares/checklogin");
const upload = require("../middlewares/upload"); // multer 미들웨어 추가
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management endpoints
 */

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
    async (req, res) => {
        const { title, content, tag } = req.body;

        if (!title || !content) {
            return res
                .status(400)
                .json({ msg: "Title and content are required" });
        }

        try {
            const newPost = new Post({
                title,
                content,
                tag,
                author: {
                    id: req.user._id,
                    name: req.user.name,
                    profilePic: req.user.profilePic,
                },
                postImg: req.file ? req.file.path : null,
            });

            const savedPost = await newPost.save();
            res.status(201).json(savedPost);
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Server error" });
        }
    }
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
router.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1; // 페이지 번호, 기본값 1
    const limit = parseInt(req.query.limit) || 10; // 페이지당 항목 수, 기본값 10
    const tag = req.query.tag;

    try {
        let query = { $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } }
        ]};
        if (tag) {
            query.tag = tag;
        }
        const posts = await Post.find(query)
            .populate("author", "name profilePic") // 작성자 이름과 프로필 사진을 가져오기 위해 populate 사용
            .sort({ createdAt: -1 }) // 새롭게 작성된 글부터 정렬
            .select("shortId title tag author postImg createdAt updatedAt") // 필요한 필드 선택
            .skip((page - 1) * limit) // 건너뛸 문서 수
            .limit(limit) // 가져올 문서 수
            .lean(); // lean 메서드를 사용하여 일반 자바스크립트 객체로 변환

        // 작성자 이름과 프로필 사진만 포함하는 형태로 변환
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

        // 전체 게시글 수를 계산하여 페이지네이션 정보 포함
        const totalPosts = await Post.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            posts: transformedPosts,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

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
router.get("/:shortId", async (req, res) => {
    const { shortId } = req.params;

    try {
        const post = await Post.findOne({ shortId })
            .populate("author.id", "name profilePic") // 작성자의 이름과 프로필 사진을 가져오기 위해 populate 사용
            .populate({
                path: "comments",
                populate: { path: "author", select: "name profilePic" }, // 댓글 작성자의 이름과 프로필 사진을 가져오기 위해 populate 사용
            })
            .lean();

        if (!post || post.isDeleted) {
            return res.status(404).json({ msg: "Post not found" });
        }

        const detailedPost = {
            shortId: post.shortId,
            title: post.title,
            content: post.content,
            tag: post.tag,
            author: {
                name: post.author.name,
                profilePic: post.author.profilePic,
            },
            postImg: post.postImg,
            comments: post.comments.map((comment) => ({
                _id: comment._id,
                author: {
                    name: comment.author.name,
                    profilePic: comment.author.profilePic,
                },
                content: comment.content,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
            })),
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };

        res.status(200).json(detailedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

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
    async (req, res) => {
        const { shortId } = req.params;
        const { title, content, tag } = req.body;

        if (!title || !content) {
            return res
                .status(400)
                .json({ msg: "Title and content are required" });
        }

        try {
            const post = await Post.findOne({ shortId });

            if (!post || post.isDeleted) {
                return res.status(404).json({ msg: "Post not found" });
            }
            // 로그 추가
            console.log("Post author ID:", post.author.id);
            console.log("Current user ID:", req.user._id);

            // 작성자와 현재 로그인한 사용자가 동일한지 확인
            if (post.author.id.toString() !== req.user._id.toString()) {
                return res
                    .status(403)
                    .json({ msg: "You are not authorized to edit this post" });
            }

            // 게시글 수정
            post.title = title;
            post.content = content;
            post.tag = tag;
            post.postImg = req.file ? req.file.path : post.postImg; // 이미지 업데이트
            post.updatedAt = Date.now(); // 수정한 시간 기록

            const updatedPost = await post.save();
            res.status(200).json(updatedPost);
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Server error" });
        }
    }
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
router.delete("/:shortId", ensureAuthenticated, async (req, res) => {
    const { shortId } = req.params;

    try {
        const post = await Post.findOne({ shortId });

        if (!post || post.isDeleted ) {
            return res.status(404).json({ msg: "Post not found" });
        }

        // 작성자와 현재 로그인한 사용자가 동일한지 확인
        if (post.author.id.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json({ msg: "You are not authorized to delete this post" });
        }

        await Post.deleteOne({ shortId });
        res.status(200).json({ msg: "Post deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

// 댓글 라우트 포함
router.use("/:postId/comments", commentRoutes);

module.exports = router;
