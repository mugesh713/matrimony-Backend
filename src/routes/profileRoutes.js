const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const {
  createProfile,
  getProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
} = require('../controllers/profileController');

// Optional: Import your auth middleware if admin protection is enabled
// const { protectAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProfiles);
router.get('/:id', getProfile);

// Admin-managed routes (Add protectAdmin middleware here if required)
router.post('/', upload.single('profileImage'), createProfile);
router.put('/:id', upload.single('profileImage'), updateProfile);
router.delete('/:id', deleteProfile);

module.exports = router;