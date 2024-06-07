const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/userSchema');
const { ensureAuthenticated } = require('../middlewares/checklogin');
const sendMail = require('../utils/sendmail');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               region:
 *                 type: string
 *               favoriteAuthor:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *               - region
 *               - favoriteAuthor
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/register', async (req, res, next) => {
    const { name, email, password, region, favoriteAuthor } = req.body;
    let errors = [];

    // 입력값 검증
    if (!name || !email || !password || !region || !favoriteAuthor) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        // 비밀번호 해시화
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            region,
            favoriteAuthor
        });

        await newUser.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        next(err);  // 에러를 전역 에러 핸들러로 전달
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

// 로그인 라우트
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json({ msg: info.message });
        }

        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            res.status(200).json({ msg: 'Logged in successfully', user: { id: user._id, name: user.name, email: user.email, region: user.region } });
        });
    })(req, res, next);
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Server error
 */

// 로그아웃 라우트
router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ msg: 'Logout failed' });
        }
        res.status(200).json({ msg: 'Logged out successfully' });
    });
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// 비밀번호 초기화 라우트
router.post('/reset-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // 8자리 무작위 숫자 생성
        const newPassword = Math.random().toString().slice(-8);

        // 비밀번호 해시화
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 사용자 업데이트
        user.password = hashedPassword;
        await user.save();

        // 이메일 전송
        const subject = '비밀번호가 변경되었습니다.';
        const text = `변경된 비밀번호는: ${newPassword} 입니다.`;
        await sendMail(email, subject, text);

        // 응답 전송
        res.status(200).json({ msg: 'Password reset successfully, please check your email for the new password.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - currentPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// 비밀번호 변경 라우트
router.post('/change-password', ensureAuthenticated, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // 기존 비밀번호 확인
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Current password is incorrect' });
        }

        // 새로운 비밀번호 해시화
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 사용자 비밀번호 업데이트
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ msg: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Google OAuth 라우트 추가
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Login with Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 */
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: The authorization code returned by Google
 *     responses:
 *       302:
 *         description: Redirects to home on successful authentication
 *       401:
 *         description: Redirects to login on failed authentication
 */
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        if (req.authInfo && req.authInfo.needAdditionalInfo) {
            return res.redirect('/auth/additional-info');
        }
        res.redirect('/');
    }
);
/**
 * @swagger
 * /auth/additional-info:
 *   post:
 *     summary: Add additional information for Google authenticated users
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               region:
 *                 type: string
 *               favoriteAuthor:
 *                 type: string
 *             required:
 *               - region
 *               - favoriteAuthor
 *     responses:
 *       200:
 *         description: Information added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/additional-info', ensureAuthenticated, async (req, res) => {
    const { region, favoriteAuthor } = req.body;

    if (!region || !favoriteAuthor) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        const user = await User.findById(req.user.id);
        user.region = region;
        user.favoriteAuthor = favoriteAuthor;
        await user.save();

        res.status(200).json({ msg: 'Information added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});
// 추가 정보 입력 페이지 렌더링
router.get('/additional-info', ensureAuthenticated, (req, res) => {
    res.render('additional-info');
});

/**
 * @swagger
 * /auth/find-email:
 *   post:
 *     summary: Find user's email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               region:
 *                 type: string
 *               favoriteAuthor:
 *                 type: string
 *             required:
 *               - name
 *               - region
 *               - favoriteAuthor
 *     responses:
 *       200:
 *         description: Email found successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/find-email', async (req, res) => {
    const { name, region, favoriteAuthor } = req.body;

    try {
        const users = await User.find({ name, region, favoriteAuthor });
        if (users.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const results = users.map(user => {
            const email = user.email;
            const [localPart, domain] = email.split('@');
            const maskedLocalPart = localPart.split('').map((char, index) => (index % 2 === 0 ? char : '*')).join('');
            const maskedEmail = `${maskedLocalPart}@${domain}`;

            return {
                email: maskedEmail,
                createdAt: user.createdAt
            };
        });

        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// 보호된 라우트 예시
// router.get('/protected', checklogin, (req, res) => {
//     res.status(200).json({ msg: 'This is a protected route' });
// });



module.exports = router;