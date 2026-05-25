const express = require("express");

const authController = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// REGISTER

router.post(
  "/register",
  authController.registerUser
);


// LOGIN

router.post(
  "/login",
  authController.loginUser
);


// GET CURRENT USER

router.get(
  "/me",
  authMiddleware.protect,
  authController.getMe
);

module.exports = router;