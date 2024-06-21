/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth endpoints
 */
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const { ensureAuthenticated } = require("../middlewares/checklogin");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원가입
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
 *         description: 회원가입이 완료되었습니다
 *       400:
 *         description: 해당 이메일로 가입한 회원이 이미 존재합니다
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
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
 *         description: 로그인 성공
 *       400:
 *         description: 로그인 실패
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: 로그아웃
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 로그아웃 되었습니다
 *       500:
 *         description: 로그아웃 실패했습니다
 */
router.get("/logout", ensureAuthenticated, authController.logout);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: 비밀번호 초기화
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
 *         description: 비밀번호가 초기화 되었습니다. 이메일 주소로 전송된 메일을 확인해 주세요
 *       404:
 *         description: 해당 이메일로 가입한 유저를 찾을 수 없습니다
 *       500:
 *         description: 서버 오류
 */

router.post("/reset-password", authController.resetPassword);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: 비밀번호 변경
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
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
 *         description: 비밀번호가 변경되었습니다
 *       403:
 *         description: 기존 비밀번호를 확인해 주세요
 *       404:
 *         description: 유저를 찾을 수 없습니다
 *       500:
 *         description: 서버 오류
 */
router.post(
    "/change-password",
    ensureAuthenticated,
    authController.changePassword
);

/**
 * @swagger
 * /auth/userinfo:
 *   get:
 *     summary: 유저 정보 패치
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 유저 정보를 불러왔습니다
 *       201:
 *         description: 로그인을 해주세요
 *       500:
 *         description: 서버 오류
 */
router.get("/userinfo", authController.userInfo);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: 구글 로그인
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 구글 인증 페이지로 리디렉션
 */
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: 구글 로그인 콜백
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 추가 정보 입력 페이지 또는 메인 페이지로 리디렉션
 */
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    authController.googleCallback
);

// 추가정보 제출
router.post(
    "/additional-info",
    ensureAuthenticated,
    authController.addAdditionalInfo
);

// 이메일 찾기
router.post("/find-email", authController.findEmail);

// 로그인 확인
router.get("/status", authController.status);

// 회원탈퇴
router.delete("/deleteUser", ensureAuthenticated, authController.deleteUser);

module.exports = router;
