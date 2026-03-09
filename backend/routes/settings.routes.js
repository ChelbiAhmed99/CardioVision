import express from "express";
import { getPublicSettings } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/public", getPublicSettings);

export default router;
