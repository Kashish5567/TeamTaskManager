const User = require("../models/User");

const bcrypt = require("bcryptjs");

const generateToken = require("../utils/generateToken");


// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",

      token: generateToken(user._id),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ==========================================
// LOGIN USER
// ==========================================

const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      message: "Login successful",

      token: generateToken(user._id),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ==========================================
// GET CURRENT USER
// ==========================================

const getMe = async (req, res) => {

  res.status(200).json(req.user);

};


module.exports = {
  registerUser,
  loginUser,
  getMe,
};