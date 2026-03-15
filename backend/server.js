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

import { connectToSQLite } from "./db/db.config.js";
import { initAdmin } from "./utils/initAdmin.js";
import { deserializeUser } from "./middleware/auth.middleware.js";
import { checkMaintenanceMode } from "./middleware/settings.middleware.js";

import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env"), override: true });

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
let PORT = parseInt(process.env.PORT) || 3000;

// Intelligent Port Management:
// Only shift if we detect a conflict on localhost/127.0.0.1
const FLASK_URL_FOR_CHECK = process.env.FLASK_API_URL || "http://127.0.0.1:8080";
try {
  const targetUrl = new URL(FLASK_URL_FOR_CHECK);
  const isFlaskOnLocalhost = targetUrl.hostname === 'localhost' || targetUrl.hostname === '127.0.0.1';

  if (isFlaskOnLocalhost && targetUrl.port == PORT) {
    console.log(chalk.bold.yellow(`🚀 LOCALHOST CONFLICT DETECTED: AI and Backend both on port ${PORT}.`));
    console.log(chalk.bold.yellow('   Shifting Backend to Port 3001 to resolve local collision.'));
    PORT = PORT == 8080 ? 3000 : PORT + 1; // Try 3000 first, then next port
  }
} catch (e) {
  // Invalid URL in env, proceed with defaults
}

console.log(chalk.cyan(`[INFO] Server starting: PORT=${PORT}, NODE_ENV=${process.env.NODE_ENV || 'development'}`));

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "CardioVision API running" });
});

// Professional logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

const printBanner = () => {
  const isProd = process.env.NODE_ENV === 'production';
  console.log(chalk.cyan(`
    ┌─────────────────────────────────────────────────────────┐
    │                                                         │
    │    ${chalk.bold.white('CardioVision API Service')}                       │
    │    ${isProd ? chalk.bold.green('🌐 Production Mode') : chalk.dim('🛠️  Local Development')}                      │
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
      const allowedOrigins = [
        process.env.CLIENT_URL,
        "http://localhost:5173",
        "http://localhost:3000"
      ].filter(Boolean);

      // Allow requests with no origin (like mobile apps or curl) or matching allowed origins
      if (!origin || allowedOrigins.some(ao => origin.startsWith(ao))) {
        callback(null, true);
      } else {
        console.warn(`⚠️ Blocked CORS request from: ${origin}`);
        callback(new Error('Not allowed by CORS'));
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

// AI Service Target configuration
const FLASK_URL = process.env.FLASK_API_URL || "http://127.0.0.1:8080";

// Proxy AI requests to Flask backend
app.use(
  "/api/ai",
  (req, res, next) => {
    // Determine if this request is about to loop
    try {
      const targetUrl = new URL(FLASK_URL);
      // Loop check: Only block if it's explicitly localhost on the same port,
      // OR if the target hostname matches the current request's hostname exactly on the same port.
      const isExactlySelf = targetUrl.hostname === req.hostname && targetUrl.port == PORT;
      const isLocalLoop = (targetUrl.hostname === 'localhost' || targetUrl.hostname === '127.0.0.1' || targetUrl.hostname === '0.0.0.0') && targetUrl.port == PORT;

      if (isExactlySelf || isLocalLoop) {
        console.error(`${chalk.red('⚠ CRITICAL PROXY LOOP DENIED:')} ${req.method} ${req.originalUrl} -> ${FLASK_URL}`);
        return res.status(508).json({
          error: "Proxy Loop Detected",
          message: "The API attempted to call itself. Check FLASK_API_URL settings.",
          details: { target: FLASK_URL, service_port: PORT, request_host: req.hostname }
        });
      }
    } catch (e) {
      console.warn("⚠ Proxy Loop Check failed (invalid URL):", e.message);
    }
    next();
  },
  proxy(FLASK_URL, {
    proxyReqPathResolver: (req) => req.originalUrl.replace("/api/ai", ""),
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Stripping cache headers to prevent 304 responses from AI backend
      delete proxyReqOpts.headers['if-none-match'];
      delete proxyReqOpts.headers['if-modified-since'];
      return proxyReqOpts;
    },
    userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
      // Enforce no caching for AI responses
      headers['cache-control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate';
      headers['pragma'] = 'no-cache';
      headers['expires'] = '0';
      return headers;
    },
    proxyErrorHandler: (err, res, next) => {
      console.error(`${chalk.red('❌ AI Proxy Error:')} ${chalk.yellow(err.code)} - ${err.message}`);

      let hint = "Ensure the AI service is running and FLASK_API_URL is correct.";
      if (err.code === 'ENOTFOUND') {
        hint = `Hostname "${err.hostname}" could not be resolved. In Railway, check that the service name is 'flask-ai' or update FLASK_API_URL.`;
      } else if (err.code === 'ECONNREFUSED') {
        hint = `Connection refused at ${FLASK_URL}. Is the Flask app listening on the correct port?`;
      }

      res.status(502).json({
        error: "AI Backend Unreachable",
        hint: hint,
        code: err.code,
        target: FLASK_URL
      });
    },
    parseReqBody: false,
    timeout: 60000, // Increased to 60s for heavy AI tasks
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

// 404 handler for API routes (prevent falling through to SPA fallback)
app.use("/api/*", (req, res) => {
  console.warn(`${chalk.yellow('⚠️ 404 Not Found (API):')} ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: "API Route Not Found",
    path: req.originalUrl
  });
});

// SPA fallback route
app.get("*", (req, res) => {
  // If it's an API request that reached here, something is wrong
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ error: "API Route Not Found (Internal Fallback)" });
  }

  console.log(`${chalk.dim('ℹ️ SPA Fallback:')} serving index.html for ${req.originalUrl}`);
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server with proper port & binding
const startServer = async () => {
  try {
    await connectToSQLite(); // Ensure DB connection before listening
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

