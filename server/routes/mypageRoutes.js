const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const User = require("../models/userSchema");
const Review = require("../models/reviewSchema");
const { ensureAuthenticated } = require("../middlewares/checklogin");
const upload = require("../middlewares/upload");

// 파일 저장 경로 및 파일명 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../../client/public/uploads/"); // 파일이 저장될 경로
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // 파일명 설정
    },
});

const upload = multer({ storage: storage });

// 프로필 편집
router.put("/profile", ensureAuthenticated, async (req, res, next) => {
    try {
        const { name, profileMsg, profilePic, favoriteAuthor } = req.body;
        const userId = req.user._id; // 인증된 사용자 ID 가져오기

        const user = await User.findByIdAndUpdate(
            userId,
            { name, profileMsg, profilePic, favoriteAuthor },
            { new: true }
        );

        if (!user) return res.status(404).send("유저를 찾을 수 없습니다.");
        res.json(user);
    } catch (error) {
        next(error);
    }
});

// 프로필 사진 업로드
router.put(
    "/profilePicture",
    ensureAuthenticated,
    upload.single("profilePicture"),
    async (req, res, next) => {
        try {
            const userId = req.user._id; // 인증된 사용자 ID 가져오기
            const profilePic = `/uploads/${req.file.filename}`;

            const user = await User.findByIdAndUpdate(
                userId,
                { profilePic },
                { new: true }
            );

            if (!user) return res.status(404).send("유저를 찾을 수 없습니다.");
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
);

// 찜해둔 도서관 목록
router.get(
    "/favoriteLibrariesList",
    ensureAuthenticated,
    async (req, res, next) => {
        try {
            const userId = req.user._id; // 인증된 사용자 ID 가져오기
            const user =
                await User.findById(userId).populate("favoriteLibraries");
            if (!user) return res.status(404).send("유저를 찾을 수 없습니다.");
            res.json(user.favoriteLibraries);
        } catch (error) {
            next(error);
        }
    }
);

// 도서관 찜하기
router.post(
    "/favoriteLibraries",
    ensureAuthenticated,
    async (req, res, next) => {
        try {
            const userId = req.user._id; // 인증된 사용자 ID 가져오기
            const { libraryId } = req.body;
            const user = await User.findById(userId);
            if (!user) return res.status(404).send("유저를 찾을 수 없습니다.");

            if (!user.favoriteLibraries.includes(libraryId)) {
                user.favoriteLibraries.push(libraryId);
                await user.save();
                res.status(200).send("도서관을 추가했습니다.");
            } else {
                res.status(400).send("이미 찜한 도서관입니다.");
            }
        } catch (error) {
            next(error);
        }
    }
);

// 찜한 도서관 삭제
router.delete(
    "/favoriteLibraries",
    ensureAuthenticated,
    async (req, res, next) => {
        try {
            const userId = req.user._id; // 인증된 사용자 ID 가져오기
            const { libraryId } = req.body; // 클라이언트로부터 받아온 도서관 ID
            const user = await User.findById(userId);
            if (!user) return res.status(404).send("유저를 찾을 수 없습니다.");

            user.favoriteLibraries = user.favoriteLibraries.filter(
                (id) => id.toString() !== libraryId
            );
            await user.save();
            res.status(200).send("도서관을 삭제했습니다.");
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
