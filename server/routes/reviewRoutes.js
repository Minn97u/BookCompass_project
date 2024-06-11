const express = require("express");
const router = express.Router();
const Review = require("../models/reviewSchema");
const Library = require("../models/librarySchema");
const { ensureAuthenticated } = require("../middlewares/checklogin");

// 리뷰 목록 조회
router.get("/", async (req, res, next) => {
    try {
        const reviews = await Review.find()
            .populate("user")
            .populate("library");
        res.json(reviews);
    } catch (error) {
        next(error);
    }
});

// 특정 유저의 리뷰 목록 조회
router.post("/user", async (req, res, next) => {
    try {
        const { userId } = req.body;
        const reviews = await Review.find({ user: userId }).populate("library");
        res.json(reviews);
    } catch (error) {
        next(error);
    }
});

// 리뷰 작성
router.post("/", ensureAuthenticated, async (req, res, next) => {
    try {
        const { userId, libraryId, rating, comment } = req.body;

        const review = new Review({
            user: userId,
            library: libraryId,
            rating,
            comment,
        });

        await review.save();

        // 도서관의 평균 별점 업데이트
        const reviews = await Review.find({ library: libraryId });
        const averageRating =
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length;

        await Library.findByIdAndUpdate(libraryId, { averageRating });

        res.json(review);
    } catch (error) {
        next(error);
    }
});

// 리뷰 삭제
router.delete("/:reviewId", ensureAuthenticated, async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);

        if (review) {
            await review.remove();

            // 도서관의 평균 별점 업데이트
            const reviews = await Review.find({ library: review.library });
            const averageRating =
                reviews.reduce((sum, review) => sum + review.rating, 0) /
                reviews.length;

            await Library.findByIdAndUpdate(review.library, { averageRating });

            res.status(200).send("리뷰를 삭제했습니다.");
        } else {
            res.status(404).send("리뷰를 찾을 수 없습니다.");
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
