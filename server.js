const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load .env
dotenv.config();

// Database
const connectDB = require("./src/config/db");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const profileRoutes = require("./src/routes/profileRoutes");

const app = express();

// ===============================
// Connect Database
// ===============================
connectDB();

// ===============================
// Dynamic CORS Middleware Setup
// ===============================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://matrimonyweb-theta.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// API Routes
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profiles", profileRoutes);

// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Matrimony Backend Running Successfully",
  });
});

// ===============================
// 404 Route
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// ===============================
// Error Handler
// ===============================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("======================================");
  console.log(`🚀 Server Running Successfully`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("======================================");
});
