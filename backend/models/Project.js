const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(

  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User",
      },
    ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Project",
  projectSchema
);