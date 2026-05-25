const Notification = require("../models/Notification");
const notificationService = require("../services/notificationService");

// LIST NOTIFICATIONS
const getNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE NOTIFICATION (optional; usable by frontend/admin tools)
const createNotification = async (req, res) => {
  try {
    const { type, title, desc, userId } = req.body;

    const targetUserId = userId || req.user._id;

    if (!type || !title) {
      return res.status(400).json({
        message: "Type and title are required",
      });
    }

    const notif = await notificationService.create({
      user: targetUserId,
      type,
      title,
      desc,
    });

    res.status(201).json({
      message: "Notification created",
      notification: notif,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// MARK ONE READ
const markRead = async (req, res) => {
  try {
    const notif = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notif) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notif.unread = false;
    await notif.save();

    res.status(200).json({
      message: "Notification marked as read",
      notification: notif,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// MARK ALL READ
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, unread: true },
      { $set: { unread: false } }
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE NOTIFICATION
const deleteNotification = async (req, res) => {
  try {
    const notif = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notif) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    await notif.deleteOne();

    res.status(200).json({
      message: "Notification dismissed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markRead,
  markAllRead,
  deleteNotification,
};
