/**
 * @swagger
 * tags:
 *   name: MyPage
 *   description: 마이페이지 관리
 */
const express = require("express");
const router = express.Router();
const mypageController = require("../controllers/mypageController");
const { ensureAuthenticated } = require("../middlewares/checklogin");
const upload = require("../middlewares/upload");

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
router.get("/profile", ensureAuthenticated, mypageController.getUserProfile);

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
    mypageController.updateUserProfile
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
router.get("/myPosts", ensureAuthenticated, mypageController.getUserPosts);

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
    mypageController.deleteUserPost
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
router.get(
    "/myComments",
    ensureAuthenticated,
    mypageController.getUserComments
);

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
    mypageController.deleteUserComment
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
    mypageController.getUserFavoriteLibraries
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
    mypageController.getUserFavoriteParks
);

/**
 * @swagger
 * /mypage/favorites:
 *   delete:
 *     summary: 찜한 도서관 및 공원 삭제
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
 *               id:
 *                 type: string
 *                 description: 도서관 또는 공원의 ID
 *               type:
 *                 type: string
 *                 enum: [library, park]
 *                 description: 삭제할 대상의 유형 (도서관 또는 공원)
 *     responses:
 *       200:
 *         description: 찜한 도서관 또는 공원을 삭제했습니다.
 *       400:
 *         description: 잘못된 요청입니다.
 *       404:
 *         description: 유저를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류가 발생했습니다.
 */
router.delete(
    "/favorites",
    ensureAuthenticated,
    mypageController.deleteUserFavorite
);

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
router.get("/myReviews", ensureAuthenticated, mypageController.getUserReviews);

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
    mypageController.deleteUserReview
);

module.exports = router;
