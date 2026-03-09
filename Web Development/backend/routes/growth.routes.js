import express from "express";
import { joinWaitlist, getWaitlistStats } from "../controllers/growth.controller.js";

const router = express.Router();

router.post("/waitlist", joinWaitlist);
router.get("/stats", getWaitlistStats);

export default router;
