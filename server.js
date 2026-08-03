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
// Dynamic CORS Configuration
// ===============================
const allowedOrigins = [
  "https://matrimony-blue.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

// Append CLIENT_URL from .env if provided
if (process.env.CLIENT_URL) {
  const cleanUrl = process.env.CLIENT_URL.replace(/\/$/, "");
  if (!allowedOrigins.includes(cleanUrl)) {
    allowedOrigins.push(cleanUrl);
  }
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser requests (e.g., Postman, mobile apps, server-to-server)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/$/, "");

      // Allow if listed explicitly OR if it matches any Vercel domain (*.vercel.app)
      const isAllowedVercelDomain = /\.vercel\.app$/.test(cleanOrigin);

      if (allowedOrigins.includes(cleanOrigin) || isAllowedVercelDomain) {
        return callback(null, true);
      } else {
        console.error(`CORS Blocked Origin: ${origin}`);
        return callback(new Error("CORS policy error: Origin not allowed."));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

  res.status(err.status || 500).json({
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
