const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(

  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    dueDate: {
      type: Date,
    },

    priority: {
      type: String,

      enum: [
        "Low",
        "Medium",
        "High",
      ],

      default: "Medium",
    },

    status: {
      type: String,

      enum: [
        "To Do",
        "In Progress",
        "Done",
      ],

      default: "To Do",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Project",

      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },
  },

  {
    timestamps: true,
  }
);


// FIX OVERWRITE MODEL ERROR

module.exports =
  mongoose.models.Task ||
  mongoose.model("Task", taskSchema);