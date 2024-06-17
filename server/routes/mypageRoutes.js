/**
 * @swagger
 * tags:
 *   name: MyPage
 *   description: 마이페이지 관리
 */

const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const Post = require("../models/postSchema");
const Comment = require("../models/commentSchema");
const Review = require("../models/reviewSchema");
const { ensureAuthenticated } = require("../middlewares/checklogin");
const upload = require("../middlewares/upload");
const path = require("path");

/**
 * @swagger
 * /mypage/profile:
 *   get:
 *     summary: 유저 프로필 정보 가져오기
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 유저 프로필 정보 반환
 */
router.get("/profile", ensureAuthenticated, async (req, res, next) => {
    try {
        const userId = req.user._id; // 인증된 사용자 ID 가져오기
        const user = await User.findById(userId).select("-password"); // 비밀번호 필드 제외하고 유저 정보 가져오기

        if (!user) return res.status(404).send("유저를 찾을 수 없습니다.");
        res.json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /mypage/profile:
 *   put:
 *     summary: 프로필 편집 및 사진 업로드
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               profileMsg:
 *                 type: string
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 유저 프로필 정보 반환
 */
router.put(
    "/profile",
    ensureAuthenticated,
    upload.single("profilePic"),
    async (req, res, next) => {
        try {
            const { name, profileMsg } = req.body;
            const userId = req.user._id; // 인증된 사용자 ID 가져오기

            // 업데이트할 데이터를 객체로 생성
            const updateData = { name, profileMsg };

            // 프로필 사진이 존재하면 updateData에 추가
            if (req.file) {
                const filePath = path.join(
                    __dirname,
                    "..",
                    "client",
                    "public",
                    "uploads",
                    req.file.filename
                );
                updateData.profilePic = `/uploads/${req.file.filename}`;
            }

            const user = await User.findByIdAndUpdate(userId, updateData, {
                new: true,
            });

            if (!user) return res.status(404).send("유저를 찾을 수 없습니다.");
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /mypage/uploads/{filename}:
 *   get:
 *     summary: 프로필 사진 가져오기
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: 파일 이름
 *     responses:
 *       200:
 *         description: 프로필 사진 반환
 */
router.get(
    "/uploads/:filename",
    ensureAuthenticated,
    async (req, res, next) => {
        try {
            const filename = req.params.filename;
            const filePath = path.join(
                __dirname,
                "..",
                "..",
                "client",
                "public",
                "uploads",
                filename
            );

            res.sendFile(filePath);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /mypage/myPosts:
 *   get:
 *     summary: 내가 쓴 글 목록 조회
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 내가 쓴 글 목록 반환
 */
router.get("/myPosts", ensureAuthenticated, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const posts = await Post.find({ "author.id": userId });

        res.json(posts);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /mypage/myPosts/{postId}:
 *   delete:
 *     summary: 내가 쓴 글 삭제
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: 글 ID
 *     responses:
 *       200:
 *         description: 글을 삭제했습니다.
 */

router.delete(
    "/myPosts/:postId",
    ensureAuthenticated,
    async (req, res, next) => {
        try {
            const { postId } = req.params; // shortId
            const userId = req.user._id;

            const post = await Post.findOneAndDelete({
                shortId: postId,
                "author.id": userId,
            });
            if (!post) {
                console.error(
                    `Post not found: postId=${postId}, userId=${userId}`
                );
                return res.status(404).send("글을 찾을 수 없습니다.");
            }

            res.status(200).send("글을 삭제했습니다.");
        } catch (error) {
            console.error("게시글 삭제 중 오류 발생:", error);
            res.status(500).json({ message: "서버 오류로 삭제 못 했습니다." });
            next(error);
        }
    }
);

/**
 * @swagger
 * /mypage/myComments:
 *   get:
 *     summary: 내가 쓴 댓글 목록 조회
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 내가 쓴 댓글 목록 반환
 */
router.get("/myComments", ensureAuthenticated, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const comments = await Comment.find({ author: userId }).populate(
            "postId",
            "shortId tittle"
        );

        const formattedComments = comments.map((comment) => ({
            _id: comment._id,
            content: comment.content,
            date: comment.createdAt,
            postId: comment.postId ? comment.postId.shortId : null,
            postTitle: comment.postId ? comment.postId.title : null,
        }));
        console.log("목록:", formattedComments);
        res.json(formattedComments);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /mypage/myComments/{commentId}:
 *   delete:
 *     summary: 내가 쓴 댓글 삭제
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: 댓글 ID
 *     responses:
 *       200:
 *         description: 댓글을 삭제했습니다.
 */
router.delete(
    "/myComments/:commentId",
    ensureAuthenticated,
    async (req, res, next) => {
        try {
            const { commentId } = req.params;
            const userId = req.user._id;

            const comment = await Comment.findOneAndDelete({
                _id: commentId,
                author: userId,
            });
            if (!comment)
                return res.status(404).send("댓글을 찾을 수 없습니다.");

            res.status(200).send("댓글을 삭제했습니다.");
        } catch (error) {
            console.error("댓글 삭제 중 오류 발생:", error);
            res.status(500).json({ message: "서버 오류로 삭제 못 했습니다." });
            next(error);
        }
    }
);

/**
 * @swagger
 * /mypage/favoriteLibrariesList:
 *   get:
 *     summary: 찜해둔 도서관 목록
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 찜해둔 도서관 목록 반환
 */
router.get(
    "/favoriteLibrariesList",
    ensureAuthenticated,
    async (req, res, next) => {
        try {
            const userId = req.user._id; // 인증된 사용자 ID 가져오기
            const user = await User.findById(userId).populate(
                "favoriteLibraries"
            );
            if (!user) return res.status(404).send("유저를 찾을 수 없습니다.");
            res.json(user.favoriteLibraries);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /mypage/favoriteParksList:
 *   get:
 *     summary: 찜해둔 공원 목록
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 찜해둔 공원 목록 반환
 */
router.get(
    "/favoriteParksList",
    ensureAuthenticated,
    async (req, res, next) => {
        try {
            const userId = req.user._id; // 인증된 사용자 ID 가져오기
            const user = await User.findById(userId).populate("favoriteParks");
            if (!user) return res.status(404).send("유저를 찾을 수 없습니다.");
            res.json(user.favoriteParks);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /mypage/favoriteParks:
 *   delete:
 *     summary: 찜한 공원 삭제
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libraryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: 공원을 삭제했습니다.
 */
router.delete("/favorites", ensureAuthenticated, async (req, res, next) => {
    try {
        const userId = req.user._id; // 인증된 사용자 ID 가져오기
        const { id, type } = req.body; // 클라이언트로부터 받아온 ID와 유형

        const user = await User.findById(userId);
        if (!user) return res.status(404).send("유저를 찾을 수 없습니다.");

        if (type === "library") {
            user.favoriteLibraries = user.favoriteLibraries.filter(
                (libraryId) => libraryId.toString() !== id
            );
            await user.save();
            res.status(200).send("도서관을 삭제했습니다.");
        } else if (type === "park") {
            user.favoriteParks = user.favoriteParks.filter(
                (parkId) => parkId.toString() !== id
            );
            await user.save();
            res.status(200).send("공원을 삭제했습니다.");
        } else {
            res.status(400).send("잘못된 유형입니다.");
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /mypage/myReviews:
 *   get:
 *     summary: 내가 쓴 리뷰 목록 조회
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 내가 쓴 리뷰 목록 반환
 */
router.get("/myReviews", ensureAuthenticated, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const reviews = await Review.find({ user: userId })
            .populate("library")
            .populate("park");

        const formattedReviews = reviews.map((review) => ({
            _id: review._id,
            rating: review.rating,
            comment: review.comment,
            date: review.createdAt,
            libraryName: review.library ? review.library.name : null,
            parkName: review.park ? review.park.name : null,
        }));
        res.json(formattedReviews);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /mypage/myReviews/{reviewId}:
 *   delete:
 *     summary: 내가 쓴 리뷰 삭제
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: 리뷰 ID
 *     responses:
 *       200:
 *         description: 리뷰를 삭제했습니다.
 */
router.delete(
    "/myReviews/:reviewId",
    ensureAuthenticated,
    async (req, res, next) => {
        try {
            const { reviewId } = req.params;
            const userId = req.user._id;

            const review = await Review.findOneAndDelete({
                _id: reviewId,
                user: userId,
            });
            if (!review)
                return res.status(404).send("리뷰를 찾을 수 없습니다.");

            res.status(200).send("리뷰를 삭제했습니다.");
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
