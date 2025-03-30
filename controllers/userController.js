const User = require("../models/userModel");
const { sanitizeInput } = require("../utils/validation");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Failed to fetch user",
        error: error.message,
      });
  }
};

// Get current user (profile)
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Failed to fetch profile",
        error: error.message,
      });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "This route is not for password updates",
        });
    }
    const sanitizedData = sanitizeInput(req.body);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      sanitizedData,
      { new: true, runValidators: true }
    ).select("-password");
    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    res.status(200).json({ status: "success", data: { user: updatedUser } });
  } catch (error) {
    res
      .status(400)
      .json({
        status: "error",
        message: "Failed to update user",
        error: error.message,
      });
  }
};

// Update current user
exports.updateCurrentUser = async (req, res) => {
  try {
    if (req.body.password) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "This route is not for password updates",
        });
    }
    const sanitizedData = sanitizeInput(req.body);
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      sanitizedData,
      { new: true, runValidators: true }
    ).select("-password");
    res.status(200).json({ status: "success", data: { user: updatedUser } });
  } catch (error) {
    res
      .status(400)
      .json({
        status: "error",
        message: "Failed to update profile",
        error: error.message,
      });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Failed to delete user",
        error: error.message,
      });
  }
};

// Delete current user (deactivate account)
exports.deleteCurrentUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Failed to delete account",
        error: error.message,
      });
  }
};
