const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const Admin = require("./models/Admin");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existing = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: hash,
      role: "admin",
    });

    console.log("Admin created successfully");
    process.exit();

  } catch (err) {
    console.log(err);
    process.exit();
  }
}

createAdmin();