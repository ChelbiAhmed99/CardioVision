import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";
import morgan from "morgan";
import chalk from "chalk";

import videoRoutes from "./routes/videos.routes.js";
import authRoutes from "./routes/auth.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import growthRoutes from "./routes/growth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

import { connectToDB } from "./db/db.config.js";
import { initAdmin } from "./utils/initAdmin.js";
import { deserializeUser } from "./middleware/auth.middleware.js";
import { checkMaintenanceMode } from "./middleware/settings.middleware.js";

import path from "path";
import { fileURLToPath } from "url";

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
const PORT = process.env.PORT || 3000;

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "CardioVision API running" });
});

// Professional logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

const printBanner = () => {
  console.log(chalk.cyan(`
    ┌─────────────────────────────────────────────────────────┐
    │                                                         │
    │    ${chalk.bold.white('CardioVision API Service')}                       │
    │    ${chalk.dim('Local Development Mode')}                             │
    │                                                         │
    │    ${chalk.green('🚀 Backend:')}   ${chalk.underline('http://localhost:' + PORT)}             │
    │    ${chalk.blue('🔗 AI Proxy:')}  ${chalk.dim(process.env.FLASK_API_URL || 'http://localhost:8080')}     │
    │                                                         │
    └─────────────────────────────────────────────────────────┘
    `));
};

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:3000"].filter(Boolean);
      if (!origin || allowedOrigins.some(ao => origin.startsWith(ao))) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in dev, but process.env.CLIENT_URL is primary
      }
    },
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
  proxy(process.env.FLASK_API_URL || "http://127.0.0.1:8080", {
    proxyReqPathResolver: (req) => req.originalUrl.replace("/api/ai", ""),
    proxyErrorHandler: (err, res, next) => {
      console.error(`❌ Proxy Error to Flask: ${err.code} - ${err.message}`);
      res.status(502).json({
        error: "AI Backend unreachable",
        details: err.code,
        target: process.env.FLASK_API_URL
      });
    },
    parseReqBody: false,
    timeout: 30000, // 30s timeout
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
    await connectToDB(); // Ensure DB connection before listening
    await initAdmin(); // Auto-initialize admin account
    app.listen(PORT, "0.0.0.0", () => {
      printBanner();
      console.log(chalk.green(`✓ Server is listening and ready`));
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit container if DB fails
  }
};

startServer();

