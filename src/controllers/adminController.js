const Admin = require("../models/Admin");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { cloudinary } = require("../config/cloudinary");

// ===================
// Admin Login
// ===================
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || "7d",
      }
    );

    res.json({
      success: true,
      token,
      admin,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===================
// Get All Users
// ===================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===================
// Delete User
// ===================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      user.profilePic &&
      user.profilePic.public_id
    ) {
      await cloudinary.uploader.destroy(
        user.profilePic.public_id
      );
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};