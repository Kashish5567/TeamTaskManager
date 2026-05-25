const express = require("express");

const router = express.Router();

const memberController = require("../controllers/memberController");
const authMiddleware = require("../middleware/authMiddleware");

// LIST + CREATE
router.get("/", authMiddleware.protect, memberController.getMembers);
router.post("/", authMiddleware.protect, memberController.createMember);

// GET + UPDATE + DELETE
router.get("/:id", authMiddleware.protect, memberController.getMemberById);
router.put("/:id", authMiddleware.protect, memberController.updateMember);
router.delete("/:id", authMiddleware.protect, memberController.deleteMember);

module.exports = router;
