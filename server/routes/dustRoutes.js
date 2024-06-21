const express = require("express");
const router = express.Router();
const dustController = require("../controllers/dustController");

/**
 * @swagger
 * tags:
 *   name: Dust
 *   description: 미세먼지 관련 API
 */

/**
 * @swagger
 * /api/dust:
 *   get:
 *     summary: 모든 미세먼지 데이터를 조회
 *     tags: [Dust]
 *     responses:
 *       200:
 *         description: 미세먼지 데이터 배열
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dataTime:
 *                     type: string
 *                     description: 측정일시
 *                     example: "2024-06-22 02:00"
 *                   pm10Value:
 *                     type: string
 *                     description: 미세먼지(PM10) 농도
 *                     example: "25"
 *                   khaiGrade:
 *                     type: string
 *                     description: 통합대기환경지수
 *                     example: "2"
 *       500:
 *         description: 서버 오류
 */
router.get("/", dustController.getDust);

module.exports = router;
