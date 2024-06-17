/**
 * @swagger
 * tags:
 *   name: Libraries
 *   description: 도서관 정보 관리
 */

const express = require('express');
const router = express.Router();
const Library = require('../models/librarySchema');
const User = require('../models/userSchema');
const Review = require('../models/reviewSchema');
const { ensureAuthenticated } = require('../middlewares/checklogin');

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
router.get('/', async (req, res, next) => {
    try {
        const libraries = await Library.find();

        // 각 도서관의 리뷰와 평균 평점 포함
        const librariesWithRatings = await Promise.all(
            libraries.map(async library => {
                const reviews = await Review.find({ library: library._id });
                let averageRating = 0;
                if (reviews.length > 0) {
                    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                    averageRating = totalRating / reviews.length;
                }
                return {
                    ...library._doc,
                    averageRating,
                };
            })
        );

        res.json(librariesWithRatings);
        console.log(librariesWithRatings);
    } catch (error) {
        next(error);
    }
});

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
// librariesRoutes.js
router.get('/:libraryId', async (req, res, next) => {
    try {
        const { libraryId } = req.params;
        const library = await Library.findById(libraryId);
        if (!library) {
            return res.status(404).send('도서관을 찾을 수 없습니다.');
        }

        const reviews = await Review.find({ library: libraryId });

        // 평균 평점 계산
        let averageRating = 0;
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            averageRating = totalRating / reviews.length;
        }

        res.json({
            ...library._doc,
            averageRating,
            reviews,
        });
    } catch (error) {
        next(error);
    }
});

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
router.post('/favoriteLibraries', ensureAuthenticated, async (req, res, next) => {
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
});

module.exports = router;
