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
 *   description: Auth endpoints
 */

//회원가입
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - region
 *               - favoriteAuthor
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
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Input validation error or email already exists
 */
router.post('/register', async (req, res, next) => {
    const { name, email, password, region, favoriteAuthor } = req.body;
    let errors = [];

    // 입력값 검증
    if (!name || !email || !password || !region || !favoriteAuthor) {
        errors.push({ msg: '모두 입력해 주세요' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ msg: '해당 이메일로 가입한 회원이 이미 존재합니다' });
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
        res.status(201).json({ msg: '회원가입이 완료되었습니다' });
    } catch (err) {
        next(err);  // 에러를 전역 에러 핸들러로 전달
    }
});

// 로그인 라우트
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json({ msg: "로그인 실패" });
        }

        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            res.status(200).json({ msg: '로그인 성공',  user: { 
                id: user._id, name: user.name, email: user.email, region: user.region, favoriteAuthor: user.favoriteAuthor
            }});
        });
    })(req, res, next);
});


// 로그아웃 라우트
/**
 * @swagger
 * /api/logout:
 *   get:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 로그아웃 되었습니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 로그아웃 되었습니다
 *       500:
 *         description: 로그아웃 실패 또는 세션 삭제에 실패했습니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 로그아웃 실패했습니다
 *                 error:
 *                   type: string
 *                   example: 세션 삭제에 실패했습니다
 */
router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ msg: '로그아웃 실패했습니다' });
        }
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ msg: '세션 삭제에 실패했습니다', error: err });
            }
            res.clearCookie('connect.sid'); // 세션 쿠키 삭제
            return res.status(200).json({ msg: '로그아웃 되었습니다' });
        });
    });
});

// 비밀번호 초기화 라우트
/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Reset a user's password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/reset-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: '해당 이메일로 가입한 유저를 찾을 수 없습니다' });
        }

        // 소셜 로그인 회원인지 확인
        if (user.password === null) {
            return res.status(400).json({ msg: '소셜로그인을 진행해 주세요' });
        }

        // 비밀번호 초기화 로직
        const newPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        // 이메일로 새로운 비밀번호 전송
        await sendMail(user.email, 'Password Reset', `Your new password is: ${newPassword}`);

        res.status(200).json({ msg: '비밀번호가 초기화 되었습니다. 이메일 주소로 전송된 메일을 확인해 주세요' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});


// 비밀번호 변경 라우트
/**
 * @swagger
 * /api/change-password:
 *   post:
 *     summary: Change the current user's password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid current password or input validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/change-password', ensureAuthenticated, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ msg: '모두 입력해 주세요' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: '유저를 찾을 수 없습니다' });
        }

        // 소셜 로그인 회원인지 확인
        if (user.password === null) {
            return res.status(400).json({ msg: '소셜회원은 비밀번호를 변경할 수 없습니다' });
        }

        // 기존 비밀번호 확인
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(403).json({ msg: '기존 비밀번호를 확인해 주세요' });
        }

        // 새로운 비밀번호 해시화
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 사용자 비밀번호 업데이트
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ msg: '비밀번호가 변경되었습니다' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

//구글 로그인
/**
 * @swagger
 * /api/google:
 *   get:
 *     summary: Authenticate with Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication
 */
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
/**
 * @swagger
 * /api/google/callback:
 *   get:
 *     summary: Google authentication callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect based on authentication result
 */
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.json({ message: 'Login successful', user: req.user });
    }
);
/**
 * @swagger
 * /api/additional-info:
 *   post:
 *     summary: Add additional information for the user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - region
 *               - favoriteAuthor
 *             properties:
 *               region:
 *                 type: string
 *               favoriteAuthor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Information added successfully
 *       400:
 *         description: Input validation error
 *       500:
 *         description: Server error
 */
router.post('/additional-info', ensureAuthenticated, async (req, res) => {
    const { region, favoriteAuthor } = req.body;

    if (!region || !favoriteAuthor) {
        return res.status(400).json({ msg: '모두 입력해 주세요' });
    }

    try {
        const user = await User.findById(req.user.id);
        user.region = region;
        user.favoriteAuthor = favoriteAuthor;
        await user.save();

        res.status(200).json({ msg: '정보가 추가되었습니다' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});
// /**
//  * @swagger
//  * /api/additional-info:
//  *   get:
//  *     summary: Render additional info page
//  *     tags: [Auth]
//  *     responses:
//  *       200:
//  *         description: Page rendered successfully
//  */
// router.get('/additional-info', ensureAuthenticated, (req, res) => {
//     res.render('additional-info');
// });

//이메일 찾기
/**
 * @swagger
 * /api/find-email:
 *   post:
 *     summary: Find user email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - region
 *               - favoriteAuthor
 *             properties:
 *               name:
 *                 type: string
 *               region:
 *                 type: string
 *               favoriteAuthor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email found and masked
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
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
//로그인 확인

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Check login status
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User is logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loggedIn:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: User is not logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loggedIn:
 *                   type: boolean
 *                   example: false
 */
router.get('/status', async (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json({ loggedIn: true });
    } else {
      res.status(401).json({ loggedIn: false });
    }
});

module.exports = router;