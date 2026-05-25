const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["task", "deadline", "message", "invite"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    desc: {
      type: String,
      trim: true,
    },

    unread: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
