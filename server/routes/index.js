const express = require("express");
const router = express.Router();

const parkRoutes = require("./parkRoutes");
const authRoutes = require("./authRoutes");
const postRoutes = require("./postRoutes");
const mypageRoutes = require("./mypageRoutes");
const libraryRoutes = require("./libraryRoutes");
const reviewRoutes = require("./reviewRoutes");
const libraryLocationRoutes = require("./libraryLocationRoutes");
const parkLocationRoutes = require("./parkLocationRoutes");

router.use("/parks", parkRoutes);
router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/mypage", mypageRoutes);
router.use("/libraries", libraryRoutes);
router.use("/reviews", reviewRoutes);
router.use("/library-locations", libraryLocationRoutes);
router.use("/park-locations", parkLocationRoutes);

module.exports = router;
