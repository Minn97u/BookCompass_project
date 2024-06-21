const express = require("express");
const router = express.Router();
const dustController = require("../controllers/dustController");

router.get("/", dustController.getDust);

module.exports = router;
