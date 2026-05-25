const express = require("express");

const router = express.Router();

const dashboardController = require(
  "../controllers/dashboardController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);


// DASHBOARD ANALYTICS

router.get(
  "/",
  authMiddleware.protect,
  dashboardController.getDashboardData
);

module.exports = router;