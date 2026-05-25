const express = require("express");

const router = express.Router();

const taskController = require(
  "../controllers/taskController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

console.log("TASK ROUTES LOADED");


// CREATE TASK

router.post(
  "/",
  authMiddleware.protect,
  taskController.createTask
);


// GET PROJECT TASKS

router.get(
  "/project/:projectId",
  authMiddleware.protect,
  taskController.getProjectTasks
);


// UPDATE TASK STATUS

router.put(
  "/:id/status",
  authMiddleware.protect,
  taskController.updateTaskStatus
);

// UPDATE TASK

router.put(
  "/:id",
  authMiddleware.protect,
  taskController.updateTask
);


// DELETE TASK

router.delete(
  "/:id",
  authMiddleware.protect,
  taskController.deleteTask
);

module.exports = router;
