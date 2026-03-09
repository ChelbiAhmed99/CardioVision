import express from "express";
import { getNotifications, markAsRead, clearNotifications, markAllRead } from "../controllers/notification.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.put("/mark-all-read", protectRoute, markAllRead);
router.put("/:id/read", protectRoute, markAsRead);
router.delete("/clear", protectRoute, clearNotifications);

export default router;
