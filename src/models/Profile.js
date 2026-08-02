const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    memberId: { type: String, required: true, unique: true },
    profileFor: { type: String, enum: ['Bride', 'Groom'], default: 'Groom' },
    name: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    dob: { type: String },
    age: { type: Number, default: 0 },
    height: { type: String },
    weight: { type: String },
    maritalStatus: { type: String, default: 'Single' },
    mobile: { type: String, required: true },
    parentContact: { type: String, default: '' }, // 👈 Added Parents Contact
    email: { type: String },
    religion: { type: String },
    caste: { type: String },
    subCaste: { type: String },
    kulam: { type: String },
    kuladeivam: { type: String },
    gothram: { type: String },
    rasi: { type: String },
    star: { type: String },
    education: { type: String },
    college: { type: String },
    occupation: { type: String },
    company: { type: String },
    designation: { type: String },
    annualIncome: { type: String },
    fatherName: { type: String },
    fatherOccupation: { type: String },
    motherName: { type: String },
    motherOccupation: { type: String },
    brothers: { type: Number, default: 0 },
    sisters: { type: Number, default: 0 },
    address: { type: String },
    district: { type: String, required: true },
    state: { type: String },
    pincode: { type: String },
    description: { type: String, default: '' }, // 👈 Added Description
    aboutMe: { type: String },
    partnerExpectation: { type: String },
    profileImage: {
      url: { type: String, default: '' },
      public_id: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', ProfileSchema);