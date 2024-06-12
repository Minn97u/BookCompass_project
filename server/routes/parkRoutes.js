const express = require("express");
const router = express.Router();
const Park = require("../models/parkSchema");
const User = require("../models/userSchema");
const Review = require("../models/reviewSchema");
const { ensureAuthenticated } = require("../middlewares/checklogin");

// 모든 공원 정보 조회
router.get("/", async (req, res, next) => {
    try {
        const parks = await Park.find().select(
            "-_id name district address managing_department phone latitude longitude"
        );
        res.json(parks);
    } catch (error) {
        next(error);
    }
});

// 특정 공원 정보 조회 (리뷰 및 평균 별점 포함)
router.get("/:parkId", async (req, res, next) => {
    try {
        const { parkId } = req.params;
        const park = await Park.findById(parkId).select(
            "name district address managing_department phone latitude longitude averageRating"
        );

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

// 공원 찜하기
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
