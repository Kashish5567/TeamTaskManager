const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Profile ||
  mongoose.model("Profile", profileSchema);
