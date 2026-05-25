const Profile = require("../models/Profile");

// GET MY PROFILE
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user._id,
    });

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE PROFILE (minimal)
const createProfile = async (req, res) => {
  try {
    const { bio, skills } = req.body;

    const existing = await Profile.findOne({
      user: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        message: "Profile already exists",
      });
    }

    const profile = await Profile.create({
      user: req.user._id,
      bio: bio || "",
      skills: Array.isArray(skills) ? skills : [],
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  createProfile,
};
