import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.Controller.mjs";
import { authMiddleware, restrictTo } from "../middleware/auth.middleware.mjs";

const router = Router();

router.use(authMiddleware);
router.use(restrictTo("Admin"));

router.get("/", getSettings);
router.patch("/", updateSettings);

export default router;