const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/userSchema');
const Post = require('../models/postSchema');
const Comment = require('../models/commentSchema');
const Review = require('../models/reviewSchema');
const { ensureAuthenticated } = require('../middlewares/checklogin');
const sendMail = require('../utils/sendmail');
const revokeToken = require('../utils/revokeToken');
const baseURL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.CORS_ORIGIN;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth endpoints
 */

//회원가입
router.post('/register', async (req, res, next) => {
  const { name, email, password, region, favoriteAuthor } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: '해당 이메일로 가입한 회원이 이미 존재합니다', code: 1 });
    }

    // 비밀번호 해시화
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      region,
      favoriteAuthor,
    });

    await newUser.save();
    res.status(201).json({ msg: '회원가입이 완료되었습니다', code: 0 });
  } catch (err) {
    next(err); // 에러를 전역 에러 핸들러로 전달
  }
});

// 로그인 라우트
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ msg: '로그인 실패', code: 1 });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        msg: '로그인 성공',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          region: user.region,
          favoriteAuthor: user.favoriteAuthor,
        },
        code: 0,
      });
    });
  })(req, res, next);
});

// 로그아웃 라우트
router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ msg: '로그아웃 실패했습니다', code: 1 });
    }
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ msg: '세션 삭제에 실패했습니다', error: err, code: 2 });
      }
      res.clearCookie('connect.sid'); // 세션 쿠키 삭제
      return res.status(200).json({ msg: '로그아웃 되었습니다', code: 0 });
    });
  });
});

// 비밀번호 초기화 라우트
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ msg: '해당 이메일로 가입한 유저를 찾을 수 없습니다', code: 2 });
    }

    // 소셜 로그인 회원인지 확인
    if (user.password === null) {
      return res
        .status(400)
        .json({ msg: '소셜로그인을 진행해 주세요', code: 1 });
    }

    // 비밀번호 초기화 로직
    const newPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    // 이메일로 새로운 비밀번호 전송
    await sendMail(
      user.email,
      'Password Reset',
      `Your new password is: ${newPassword}`
    );

    res.status(200).json({
      msg: '비밀번호가 초기화 되었습니다. 이메일 주소로 전송된 메일을 확인해 주세요',
      code: 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// 비밀번호 변경 라우트
router.post('/change-password', ensureAuthenticated, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: '유저를 찾을 수 없습니다', code: 1 });
    }

    // 소셜 로그인 회원인지 확인
    if (user.password === null) {
      return res
        .status(400)
        .json({ msg: '소셜회원은 비밀번호를 변경할 수 없습니다', code: 2 });
    }

    // 기존 비밀번호 확인
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(403)
        .json({ msg: '기존 비밀번호를 확인해 주세요', code: 3 });
    }

    // 새로운 비밀번호 해시화
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 사용자 비밀번호 업데이트
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ msg: '비밀번호가 변경되었습니다', code: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

//구글 로그인
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    if (req.user.favoriteAuthor === null || req.user.region === null) {
      // 추가 정보 입력 페이지로 리디렉트
      res.redirect(`${baseURL}/additionalinfo`);
    } else {
      // 메인 페이지로 리디렉트
      res.redirect(baseURL);
    }
  }
);

//유저정보패치
router.get('/userinfo', async (req, res) => {
  try {
    if (req.user) {
      res
        .status(200)
        .json({ msg: '유저정보를 불러왔습니다', user: req.user, code: 0 });
    } else {
      res.status(201).json({ msg: '로그인을 해주세요', code: 1 });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'server error' });
  }
});

//추가정보제출
router.post('/additional-info', ensureAuthenticated, async (req, res) => {
  const { region, favoriteAuthor } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.region = region;
    user.favoriteAuthor = favoriteAuthor;
    await user.save();

    res
      .status(200)
      .json({ msg: '정보가 추가되었습니다', submit: true, code: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

//이메일 찾기
router.post('/find-email', async (req, res) => {
  const { name, region, favoriteAuthor } = req.body;

  try {
    const users = await User.find({ name, region, favoriteAuthor });
    if (users.length === 0) {
      return res.status(404).json({ msg: 'User not found', code: 1 });
    }

    const results = users.map((user) => {
      const email = user.email;
      const [localPart, domain] = email.split('@');
      const maskedLocalPart = localPart
        .split('')
        .map((char, index) => (index % 2 === 0 ? char : '*'))
        .join('');
      const maskedEmail = `${maskedLocalPart}@${domain}`;

      return {
        email: maskedEmail,
        createdAt: user.createdAt,
      };
    });

    res.status(200).json({ results, code: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

//로그인 확인
router.get('/status', async (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ loggedIn: true });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

//회원탈퇴
router.delete('/deleteUser', ensureAuthenticated, async (req, res) => {
  try {
      const user = await User.findById(req.user._id);
      if (!user) {
          return res.status(404).json({ msg: '유저가 없습니다.' });
      }
      user.isDeleted = true;
      if (user.googleId) {
          if (user.googleAccessToken) {
              await revokeToken(user.googleAccessToken);
              user.googleId = undefined;
              user.googleAccessToken = undefined;
          }
      } 
      await user.save();
      // 사용자와 관련된 게시글, 댓글, 리뷰 소프트 삭제 처리
      await Post.updateMany({ "author.id": user._id }, { isDeleted: true });
      await Comment.updateMany({ "author": user._id }, { isDeleted: true });
      await Review.updateMany({ user: user._id }, { isDeleted: true });
      
      const userPosts = await Post.find({ "author.id": user._id });
      const postIds = userPosts.map(post => post._id);
      await Comment.updateMany({ postId: { $in: postIds } }, { isDeleted: true });
      res.status(200).json({ msg: '회원탈퇴 완료되었습니다.' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
