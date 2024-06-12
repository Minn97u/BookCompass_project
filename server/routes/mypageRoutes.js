const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const Post = require('../models/postSchema');
const Comment = require('../models/commentSchema');
const Review = require('../models/reviewSchema');
const { ensureAuthenticated } = require('../middlewares/checklogin');
const upload = require('../middlewares/upload');
const path = require('path');

// 유저 프로필 정보 가져오기
router.get('/profile', ensureAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user._id; // 인증된 사용자 ID 가져오기
    const user = await User.findById(userId).select('-password'); // 비밀번호 필드 제외하고 유저 정보 가져오기

    if (!user) return res.status(404).send('유저를 찾을 수 없습니다.');
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// 프로필 편집 및 사진 업로드
router.put(
  '/profile',
  ensureAuthenticated,
  upload.single('profilePic'),
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
          '..',
          'client',
          'public',
          'uploads',
          req.file.filename
        );
        updateData.profilePic = `/uploads/${req.file.filename}`;
      }

      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      if (!user) return res.status(404).send('유저를 찾을 수 없습니다.');
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

// 프로필 사진 가져오기
router.get(
  '/uploads/:filename',
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(
        __dirname,
        '..',
        'client',
        'public',
        'uploads',
        filename
      );

      res.sendFile(filePath);
    } catch (error) {
      next(error);
    }
  }
);

// 내가 쓴 글 목록 조회
router.get('/myPosts', ensureAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find({ author: userId });

    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// 내가 쓴 댓글 목록 조회
router.get('/myComments', ensureAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const comments = await Comment.find({ author: userId });

    res.json(comments);
  } catch (error) {
    next(error);
  }
});

// 찜해둔 도서관 목록
router.get(
  '/favoriteLibrariesList',
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      const userId = req.user._id; // 인증된 사용자 ID 가져오기
      const user = await User.findById(userId).populate('favoriteLibraries');
      if (!user) return res.status(404).send('유저를 찾을 수 없습니다.');
      res.json(user.favoriteLibraries);
    } catch (error) {
      next(error);
    }
  }
);

// 찜한 도서관 삭제
router.delete(
  '/favoriteLibraries',
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      const userId = req.user._id; // 인증된 사용자 ID 가져오기
      const { libraryId } = req.body; // 클라이언트로부터 받아온 도서관 ID
      const user = await User.findById(userId);
      if (!user) return res.status(404).send('유저를 찾을 수 없습니다.');

      user.favoriteLibraries = user.favoriteLibraries.filter(
        (id) => id.toString() !== libraryId
      );
      await user.save();
      res.status(200).send('도서관을 삭제했습니다.');
    } catch (error) {
      next(error);
    }
  }
);

// 내가 쓴 리뷰 목록 조회
router.get('/myReviews', ensureAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const reviews = await Review.find({ author: userId });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

// 내가 쓴 리뷰 삭제
router.delete(
  '/myReviews/:reviewId',
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const userId = req.user._id;

      const review = await Review.findOneAndDelete({
        _id: reviewId,
        author: userId,
      });
      if (!review) return res.status(404).send('리뷰를 찾을 수 없습니다.');

      res.status(200).send('리뷰를 삭제했습니다.');
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
