/**
 * @swagger
 * tags:
 *   name: Libraries
 *   description: 도서관 정보 관리
 */
const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/libraryController");
const { ensureAuthenticated } = require("../middlewares/checklogin");

/**
 * @swagger
 * /libraries:
 *   get:
 *     summary: 모든 도서관 정보 조회
 *     tags: [Libraries]
 *     responses:
 *       200:
 *         description: 모든 도서관 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   district:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   url:
 *                     type: string
 *                   hours:
 *                     type: string
 *                   holidays:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   averageRating:
 *                     type: number
 */
router.get("/", libraryController.getAllLibraries);

/**
 * @swagger
 * /libraries/{libraryId}:
 *   get:
 *     summary: 특정 도서관 정보 조회 (리뷰 및 평균 별점 포함)
 *     tags: [Libraries]
 *     parameters:
 *       - in: path
 *         name: libraryId
 *         required: true
 *         schema:
 *           type: string
 *           description: 도서관 ID
 *     responses:
 *       200:
 *         description: 특정 도서관 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 district:
 *                   type: string
 *                 address:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 url:
 *                   type: string
 *                 hours:
 *                   type: string
 *                 holidays:
 *                   type: string
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *                 averageRating:
 *                   type: number
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: string
 *                       rating:
 *                         type: number
 *                       comment:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: 도서관을 찾을 수 없습니다.
 */
router.get("/:libraryId", libraryController.getLibraryById);

/**
 * @swagger
 * /libraries/favoriteLibraries:
 *   post:
 *     summary: 도서관 찜하기
 *     tags: [Libraries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libraryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: 도서관을 추가했습니다.
 *       400:
 *         description: 이미 찜한 도서관입니다.
 */
router.post(
    "/favoriteLibraries",
    ensureAuthenticated,
    libraryController.addFavoriteLibrary
);

module.exports = router;
