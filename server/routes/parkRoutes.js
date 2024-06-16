/**
 * @swagger
 * tags:
 *   name: Parks
 *   description: 공원 정보 관리
 */

const express = require("express");
const router = express.Router();
const Park = require("../models/parkSchema");
const User = require("../models/userSchema");
const Review = require("../models/reviewSchema");
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
router.get("/", async (req, res, next) => {
    try {
        const parks = await Park.find().select();
        res.json(parks);
    } catch (error) {
        next(error);
    }
});

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
router.get("/:parkId", async (req, res, next) => {
    try {
        const { parkId } = req.params;
        const park = await Park.findById(parkId).select();

        if (!park) {
            return res.status(404).send("공원을 찾을 수 없습니다.");
        }

        const reviews = await Review.find({ park: parkId });

        res.json({
            ...park._doc,
            reviews,
        });
    } catch (error) {
        next(error);
    }
});

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
router.post("/favoriteParks", ensureAuthenticated, async (req, res, next) => {
    try {
        const userId = req.user._id; // 인증된 사용자 ID 가져오기
        const { parkId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).send("유저를 찾을 수 없습니다.");

        if (!user.favoriteParks.includes(parkId)) {
            user.favoriteParks.push(parkId);
            await user.save();
            res.status(200).send("공원을 찜했습니다.");
        } else {
            res.status(400).send("이미 찜한 공원입니다.");
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
