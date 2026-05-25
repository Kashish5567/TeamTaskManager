const Member = require("../models/Member");

// CREATE MEMBER
const createMember = async (req, res) => {
  try {
    const {
      name,
      role,
      jobTitle,
      email,
      location,
      skills,
      tasksTotal,
      tasksDone,
      avatar,
      color,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const exists = await Member.findOne({
      email: String(email).toLowerCase(),
    });

    if (exists) {
      return res.status(400).json({
        message: "Member with this email already exists",
      });
    }

    const member = await Member.create({
      name,
      role,
      jobTitle,
      email,
      location,
      skills,
      tasksTotal,
      tasksDone,
      avatar,
      color,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Member created successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LIST MEMBERS
const getMembers = async (req, res) => {
  try {
    const members = await Member.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET MEMBER
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE MEMBER
const updateMember = async (req, res) => {
  try {
    const member = await Member.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    const updatable = [
      "name",
      "role",
      "jobTitle",
      "email",
      "location",
      "skills",
      "tasksTotal",
      "tasksDone",
      "avatar",
      "color",
    ];

    for (const key of updatable) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        member[key] = req.body[key];
      }
    }

    await member.save();

    res.status(200).json({
      message: "Member updated successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE MEMBER
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    await member.deleteOne();

    res.status(200).json({
      message: "Member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
