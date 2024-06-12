const express = require('express');
const router = express.Router();
const Library = require('../models/librarySchema');
const User = require('../models/userSchema');
const { ensureAuthenticated } = require('../middlewares/checklogin');

// 모든 도서관 정보 조회
router.get('/', async (req, res, next) => {
  try {
    const libraries = await Library.find().select('-_id');
    res.json(libraries);
  } catch (error) {
    next(error);
  }
});

// 특정 도서관 정보 조회 (리뷰 및 평균 별점 포함)
router.get('/:libraryId', async (req, res, next) => {
  try {
    const { libraryId } = req.params;
    const library = await Library.findById(libraryId).select(
      'name district address phone url hours holidays latitude longitude averageRating'
    );

    if (!library) {
      return res.status(404).send('도서관을 찾을 수 없습니다.');
    }

    const reviews = await Review.find({ library: libraryId });

    res.json({
      ...library._doc,
      reviews,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

// 도서관 찜하기
router.post(
  '/favoriteLibraries',
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      const userId = req.user._id; // 인증된 사용자 ID 가져오기
      const { libraryId } = req.body;
      const user = await User.findById(userId);
      if (!user) return res.status(404).send('유저를 찾을 수 없습니다.');

      if (!user.favoriteLibraries.includes(libraryId)) {
        user.favoriteLibraries.push(libraryId);
        await user.save();
        res.status(200).send('도서관을 추가했습니다.');
      } else {
        res.status(400).send('이미 찜한 도서관입니다.');
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
