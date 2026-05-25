const express = require("express");

const router = express.Router();

const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware.protect, notificationController.getNotifications);
router.post("/", authMiddleware.protect, notificationController.createNotification);
router.put("/read-all", authMiddleware.protect, notificationController.markAllRead);
router.put("/:id/read", authMiddleware.protect, notificationController.markRead);
router.delete("/:id", authMiddleware.protect, notificationController.deleteNotification);

module.exports = router;
