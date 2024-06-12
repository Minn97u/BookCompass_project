const express = require("express");
const router = express.Router();
const Park = require("../models/parkSchema");

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

module.exports = router;
