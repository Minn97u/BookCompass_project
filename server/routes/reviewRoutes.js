const express = require('express');
const router = express.Router();
const Review = require('../models/reviewSchema');
const Library = require('../models/librarySchema');
const Park = require('../models/parkSchema');
const { ensureAuthenticated } = require('../middlewares/checklogin');

// 리뷰 목록 조회
router.get('/', async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user')
      .populate('library')
      .populate('park');

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

// 리뷰 작성
router.post('/', ensureAuthenticated, async (req, res, next) => {
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

// 리뷰 수정
router.put('/:reviewId', ensureAuthenticated, async (req, res, next) => {
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
      res.status(404).send('리뷰를 찾을 수 없습니다.');
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
