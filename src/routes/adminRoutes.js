const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getAllUsers,
  deleteUser,
} = require("../controllers/adminController");

const adminAuth = require("../middleware/adminAuth");

// =========================
// Public Route
// =========================

// Admin Login
router.post("/login", adminLogin);

// =========================
// Protected Routes
// =========================

// Get All Users
router.get("/users", adminAuth, getAllUsers);

// Delete User
router.delete("/users/:id", adminAuth, deleteUser);

module.exports = router;