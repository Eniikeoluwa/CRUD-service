// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// exports.protect = async (req, res, next) => {
//   try {
//     // 1) Check if token exists
//     let token;
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith('Bearer')
//     ) {
//       token = req.headers.authorization.split(' ')[1];
//     }

//     if (!token) {
//       return res.status(401).json({
//         status: 'error',
//         message: 'You are not logged in. Please log in to get access'
//       });
//     }

//     // 2) Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // 3) Check if user still exists
//     const currentUser = await User.findById(decoded.id);
//     if (!currentUser) {
//       return res.status(401).json({
//         status: 'error',
//         message: 'The user belonging to this token no longer exists'
//       });
//     }

//     // 4) Attach user to request object
//     req.user = currentUser;
//     next();
//   } catch (error) {
//     res.status(401).json({
//       status: 'error',
//       message: 'Authentication failed',
//       error: error.message
//     });
//   }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Protect Route (Ensure User is Logged In)
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "You are not logged in. Please log in to get access",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "error",
        message: "The user belonging to this token no longer exists",
      });
    }

    // Attach user to request object
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Authentication failed",
      error: error.message,
    });
  }
};

// Restrict Access to Admin Users
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};
