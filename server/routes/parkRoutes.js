/**
 * @swagger
 * tags:
 *   name: Parks
 *   description: 공원 정보 관리
 */
const express = require("express");
const router = express.Router();
const parkController = require("../controllers/parkController");
const { ensureAuthenticated } = require("../middlewares/checklogin");

/**
 * @swagger
 * /parks:
 *   get:
 *     summary: 모든 공원 정보 조회
 *     tags: [Parks]
 *     responses:
 *       200:
 *         description: 모든 공원 정보 반환
 */
router.get("/", parkController.getAllParks);

/**
 * @swagger
 * /parks/{parkId}:
 *   get:
 *     summary: 특정 공원 정보 조회 (리뷰 및 평균 별점 포함)
 *     tags: [Parks]
 *     parameters:
 *       - in: path
 *         name: parkId
 *         required: true
 *         schema:
 *           type: string
 *         description: 공원 ID
 *     responses:
 *       200:
 *         description: 특정 공원 정보 반환
 */
router.get("/:parkId", parkController.getParkById);

/**
 * @swagger
 * /parks/favoriteParks:
 *   post:
 *     summary: 공원 찜하기
 *     tags: [Parks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parkId:
 *                 type: string
 *     responses:
 *       200:
 *         description: 공원을 찜했습니다.
 *       400:
 *         description: 이미 찜한 공원입니다.
 */
router.post(
    "/favoriteParks",
    ensureAuthenticated,
    parkController.addFavoritePark
);

module.exports = router;
