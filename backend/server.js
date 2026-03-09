import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from "cookie-parser";

import videoRoutes from "./routes/videos.routes.js"
import authRoutes from "./routes/auth.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import growthRoutes from "./routes/growth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

import { connectToSQLite } from "./db/db.config.js";
import { deserializeUser } from "./middleware/auth.middleware.js";
import { checkMaintenanceMode } from "./middleware/settings.middleware.js";
import proxy from "express-http-proxy";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Proxy AI requests to Flask backend
app.use("/api/ai", proxy(process.env.FLASK_API_URL || "http://localhost:5000"));

app.use(deserializeUser);
app.use(checkMaintenanceMode);

app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/growth", growthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api", videoRoutes);
app.use("/uploads", express.static("uploads"));

// Serve static frontend files in production
const frontendPath = path.resolve(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// Catch-all route for frontend
app.get("*", (req, res) => {
    if (req.originalUrl.startsWith('/api')) return;
    res.sendFile(path.join(frontendPath, "index.html"));
});


app.listen(PORT, async () => {
    await connectToSQLite();
    console.log(`Server is running on ${PORT}`);
});