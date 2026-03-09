import express from "express";
import { getAnalysisHistory, saveAnalysis } from "../controllers/analysis.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/history", protectRoute, getAnalysisHistory);
router.post("/save", protectRoute, saveAnalysis);

export default router;
