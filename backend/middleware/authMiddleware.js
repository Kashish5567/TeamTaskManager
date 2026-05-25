const jwt = require("jsonwebtoken");

const User = require("../models/User");


// ==========================================
// PROTECT ROUTES
// ==========================================

const protect = async (req, res, next) => {

  try {

    let token;


    // CHECK AUTH HEADER

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      // GET TOKEN FROM HEADER

      token = req.headers.authorization.split(" ")[1];


      // VERIFY TOKEN

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );


      // GET USER

      req.user = await User.findById(
        decoded.id
      ).select("-password");


      next();

    } else {

      return res.status(401).json({
        message: "No token provided",
      });

    }

  } catch (error) {

    console.log(error);

    return res.status(401).json({
      message: "Token failed",
    });

  }
};

module.exports = {
  protect,
};