import { Router } from "express";
import { getActivityLogs } from "../controllers/activityLog.controller.mjs";
import { authMiddleware, restrictTo } from "../middleware/auth.middleware.mjs";

const router = Router();

router.use(authMiddleware);
router.use(restrictTo("Admin"));

router.get("/", getActivityLogs);

export default router;