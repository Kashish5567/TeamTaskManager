const express = require("express");

const router = express.Router();

const projectController = require(
  "../controllers/projectController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);


// CREATE PROJECT

router.post(
  "/",
  authMiddleware.protect,
  projectController.createProject
);


// GET USER PROJECTS

router.get(
  "/",
  authMiddleware.protect,
  projectController.getProjects
);


// ADD MEMBER

router.put(
  "/:id/add-member",
  authMiddleware.protect,
  projectController.addMember
);


// REMOVE MEMBER

router.put(
  "/:id/remove-member",
  authMiddleware.protect,
  projectController.removeMember
);

module.exports = router;