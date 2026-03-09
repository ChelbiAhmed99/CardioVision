import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";

import videoRoutes from "./routes/videos.routes.js";
import authRoutes from "./routes/auth.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import growthRoutes from "./routes/growth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

import { connectToSQLite } from "./db/db.config.js";
import { deserializeUser } from "./middleware/auth.middleware.js";
import { checkMaintenanceMode } from "./middleware/settings.middleware.js";

import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

// Railway dynamic port
const PORT = process.env.PORT || 3000;

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

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "CardioVision API running" });
});

// Proxy AI requests to Flask backend
app.use(
  "/api/ai",
  proxy(process.env.FLASK_API_URL || "http://localhost:5000", {
    proxyReqPathResolver: (req) => req.originalUrl.replace("/api/ai", ""),
  })
);

// Authentication + maintenance middleware
app.use(deserializeUser);
app.use(checkMaintenanceMode);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/growth", growthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api", videoRoutes);

// Static uploads
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

// Serve frontend in production
const frontendPath = path.resolve(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// SPA fallback route
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith("/api")) return;
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server with proper port & binding
const startServer = async () => {
  try {
    await connectToSQLite(); // Ensure DB connection before listening
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 CardioVision server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit container if DB fails
  }
};

startServer();
