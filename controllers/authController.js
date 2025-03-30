const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const {
  validateSignup,
  validateLogin,
  sanitizeInput,
} = require("../utils/validation");

dotenv.config(); // Load environment variables

// 🎟 Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// 📝 **Signup Controller**
exports.signup = async (req, res) => {
  try {
    // Validate input
    const { errors, isValid } = validateSignup(req.body);
    if (!isValid) {
      return res.status(400).json({ status: "error", errors });
    }

    // Sanitize input
    const sanitizedData = sanitizeInput(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: sanitizedData.email }, { username: sanitizedData.username }],
    });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User with this email or username already exists",
      });
    }

    // Create new user (password is auto-hashed in the schema)
    const newUser = await User.create({
      username: sanitizedData.username,
      email: sanitizedData.email,
      password: sanitizedData.password, // Will be hashed by Mongoose
    });

    // Generate token
    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 🔑 **Login Controller**
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists & fetch password explicitly
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ status: "error", message: "Incorrect email or password" });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ status: "error", message: "Incorrect email or password" });
    }

    // Generate token
    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 🔐 **Protect Middleware (Authentication Middleware)**
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Not authenticated. Please log in.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({ status: "error", message: "User no longer exists." });
    }

    req.user = currentUser;
    next(); // Proceed to the next middleware
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Invalid token. Please log in again.",
    });
  }
};
