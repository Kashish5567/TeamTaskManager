const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["Admin", "Member", "Viewer"],
      default: "Member",
    },

    jobTitle: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    tasksTotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    tasksDone: {
      type: Number,
      default: 0,
      min: 0,
    },

    avatar: {
      type: String,
      trim: true,
    },

    color: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Member ||
  mongoose.model("Member", memberSchema);
