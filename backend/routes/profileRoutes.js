const express = require("express");

const router = express.Router();

const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware.protect, profileController.getMyProfile);
router.post("/", authMiddleware.protect, profileController.createProfile);

module.exports = router;
