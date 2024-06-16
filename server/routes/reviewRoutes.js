/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: 리뷰 관리
 */

const express = require("express");
const router = express.Router();
const Review = require("../models/reviewSchema");
const Library = require("../models/librarySchema");
const Park = require("../models/parkSchema");
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
router.get("/", async (req, res, next) => {
    try {
        const { placeId } = req.query;

        if (!placeId) {
            return res
                .status(400)
                .json({ error: "placeId 파라미터가 필요합니다." });
        }

        const reviews = await Review.find({ library: placeId })
            .populate("user")
            .populate("library")
            .populate("park");

        const formattedReviews = reviews.map((review) => ({
            user: review.user.name,
            rating: review.rating,
            comment: review.comment,
            date: review.createdAt,
            library: review.library ? review.library.name : null,
            park: review.park ? review.park.name : null,
        }));

        res.json(formattedReviews);
    } catch (error) {
        next(error);
    }
});

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

router.post("/", ensureAuthenticated, async (req, res, next) => {
    try {
        const { userId, libraryId, parkId, rating, comment } = req.body;

        const review = new Review({
            user: userId,
            library: libraryId,
            park: parkId,
            rating,
            comment,
        });

        await review.save();

        if (libraryId) {
            // 도서관의 평균 별점 업데이트
            const reviews = await Review.find({ library: libraryId });
            const averageRating =
                reviews.reduce((sum, review) => sum + review.rating, 0) /
                reviews.length;

            await Library.findByIdAndUpdate(libraryId, { averageRating });
        } else if (parkId) {
            // 공원의 평균 별점 업데이트
            const reviews = await Review.find({ park: parkId });
            const averageRating =
                reviews.reduce((sum, review) => sum + review.rating, 0) /
                reviews.length;

            await Park.findByIdAndUpdate(parkId, { averageRating });
        }

        res.json(review);
    } catch (error) {
        next(error);
    }
});

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
router.put("/:reviewId", ensureAuthenticated, async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findById(reviewId);

        if (review) {
            review.rating = rating;
            review.comment = comment;
            await review.save();

            if (review.library) {
                // 도서관의 평균 별점 업데이트
                const reviews = await Review.find({ library: review.library });
                const averageRating =
                    reviews.reduce((sum, review) => sum + review.rating, 0) /
                    reviews.length;

                await Library.findByIdAndUpdate(review.library, {
                    averageRating,
                });
            } else if (review.park) {
                // 공원의 평균 별점 업데이트
                const reviews = await Review.find({ park: review.park });
                const averageRating =
                    reviews.reduce((sum, review) => sum + review.rating, 0) /
                    reviews.length;

                await Park.findByIdAndUpdate(review.park, { averageRating });
            }

            res.json(review);
        } else {
            res.status(404).send("리뷰를 찾을 수 없습니다.");
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
