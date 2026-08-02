const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    profilePic: {
      url: { type: String, default: '' },
      public_id: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);