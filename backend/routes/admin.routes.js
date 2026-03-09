import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { protectAdmin } from "../middleware/admin.middleware.js";
import {
    getAllUsers,
    createUser,
    updateUser,
    updateUserRole,
    deleteUser,
    getAdminStats,
    getSettings,
    updateSettings,
    getAuditLogs,
    getFeedbackStats
} from "../controllers/admin.controller.js";

const router = express.Router();

// All routes are protected by auth and admin check
router.use(protectRoute);
router.use(protectAdmin);

router.get("/users", getAllUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/stats", getAdminStats);
router.get("/settings", getSettings);
router.put("/settings", updateSettings);
router.get("/audit-logs", getAuditLogs);
router.get("/feedback-stats", getFeedbackStats);

export default router;
