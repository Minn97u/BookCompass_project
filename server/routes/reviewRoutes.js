/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: 리뷰 관리
 */
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { ensureAuthenticated } = require("../middlewares/checklogin");

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: 리뷰 목록 조회
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: 리뷰 목록 반환
 */
router.get("/", reviewController.getReviews);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: 리뷰 작성
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               libraryId:
 *                 type: string
 *               parkId:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: 리뷰가 작성되었습니다.
 */
router.post("/", ensureAuthenticated, reviewController.createReview);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   put:
 *     summary: 리뷰 수정
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: 리뷰 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: 리뷰가 수정되었습니다.
 */
router.put("/:reviewId", ensureAuthenticated, reviewController.updateReview);

module.exports = router;
