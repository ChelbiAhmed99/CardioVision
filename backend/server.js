// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import videoRoutes from "./routes/videos.routes.js";
import authRoutes from "./routes/auth.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import growthRoutes from "./routes/growth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

// Utils & middleware
import { connectToSQLite } from "./db/db.config.js";
import { initAdmin } from "./utils/initAdmin.js";
import { deserializeUser } from "./middleware/auth.middleware.js";
import { checkMaintenanceMode } from "./middleware/settings.middleware.js";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Validate JWT_SECRET
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ CRITICAL: JWT_SECRET environment variable is missing in production!");
    process.exit(1);
  } else {
    console.warn("⚠️ WARNING: JWT_SECRET is missing. Using a fallback for development ONLY.");
    process.env.JWT_SECRET = "dev-secret-do-not-use-in-production";
  }
}

const app = express();

// Railway dynamic port
const PORT = process.env.PORT || 3000;
const FLASK_API_URL = process.env.FLASK_API_URL || "http://127.0.0.1:8080";

console.log(`📡 Environment: ${process.env.NODE_ENV}`);
console.log(`🔗 Target FLASK_API_URL: ${FLASK_API_URL}`);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "CardioVision API running" });
});

// ----------------------
// Video upload proxy
// ----------------------
const upload = multer({ dest: "uploads/" });

app.post("/api/ai/api/video", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path), req.file.originalname);

    const response = await axios.post(`${FLASK_API_URL}/api/video`, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    // Remove temporary file
    fs.unlinkSync(req.file.path);

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error forwarding video to Flask:", error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Authentication + maintenance middleware
app.use(deserializeUser);
app.use(checkMaintenanceMode);

// Other API routes
app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/growth", growthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api", videoRoutes);

// Serve uploads
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

// Serve frontend in production
const frontendPath = path.resolve(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// SPA fallback route
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith("/api")) return;
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
const startServer = async () => {
  try {
    await connectToSQLite(); // Ensure DB connection
    await initAdmin();       // Initialize admin account
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 CardioVision server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
