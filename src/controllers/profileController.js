const Profile = require("../models/Profile");
const { cloudinary } = require("../config/cloudinary");

// Helper function to sanitize ALL FormData fields
const sanitizeFormData = (data) => {
  const sanitized = { ...data };

  // 1. Convert numeric fields properly
  const numericFields = ["age", "brothers", "sisters", "annualIncome"];
  numericFields.forEach((field) => {
    if (sanitized[field] !== undefined) {
      if (sanitized[field] === "" || sanitized[field] === "null" || sanitized[field] === "undefined") {
        sanitized[field] = 0;
      } else if (!isNaN(sanitized[field])) {
        sanitized[field] = Number(sanitized[field]);
      }
    }
  });

  // 2. Prevent empty strings ("" or "null" or "undefined") from overwriting existing DB text fields
  Object.keys(sanitized).forEach((key) => {
    if (
      sanitized[key] === "undefined" ||
      sanitized[key] === "null"
    ) {
      delete sanitized[key];
    }
  });

  return sanitized;
};

// ===============================
// CREATE PROFILE
// ===============================
exports.createProfile = async (req, res) => {
  try {
    const data = sanitizeFormData(req.body);

    data.memberId = "VTV" + Date.now();

    if (req.file) {
      data.profileImage = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const profile = await Profile.create(data);

    res.status(201).json({
      success: true,
      message: "Profile Added Successfully",
      profile,
    });
  } catch (err) {
    console.error("Create Profile Error:", err);
    res.status(400).json({
      success: false,
      message: err.message || "Error creating profile",
    });
  }
};

// ===============================
// GET ALL PROFILES
// ===============================
exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (err) {
    console.error("Get Profiles Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Error fetching profiles",
    });
  }
};

// ===============================
// GET SINGLE PROFILE
// ===============================
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile Not Found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error("Get Single Profile Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Error fetching profile",
    });
  }
};

// ===============================
// UPDATE PROFILE
// ===============================
exports.updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile Not Found",
      });
    }

    const updateData = sanitizeFormData(req.body);

    // If new image uploaded, remove existing from Cloudinary
    if (req.file) {
      if (profile.profileImage && profile.profileImage.public_id) {
        try {
          await cloudinary.uploader.destroy(profile.profileImage.public_id);
        } catch (cloudinaryErr) {
          console.warn("Cloudinary delete failed, proceeding with update:", cloudinaryErr.message);
        }
      }

      updateData.profileImage = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    // Fixes the Mongoose deprecation warning & prevents deleting unedited fields
    profile = await Profile.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        returnDocument: 'after', // 👈 Fixes Mongoose warning (replaces new: true)
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      profile,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(400).json({
      success: false,
      message: err.message || "Error updating profile",
    });
  }
};

// ===============================
// DELETE PROFILE
// ===============================
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile Not Found",
      });
    }

    if (profile.profileImage && profile.profileImage.public_id) {
      try {
        await cloudinary.uploader.destroy(profile.profileImage.public_id);
      } catch (cloudinaryErr) {
        console.warn("Cloudinary image deletion warning:", cloudinaryErr.message);
      }
    }

    await Profile.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Profile Deleted Successfully",
    });
  } catch (err) {
    console.error("Delete Profile Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Error deleting profile",
    });
  }
};