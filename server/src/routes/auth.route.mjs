import { Router } from "express";
import { loginUser } from "../controllers/auth.controller.mjs";
import { verifyUser } from "../controllers/auth.controller.mjs";
import { authMiddleware } from "../middleware/auth.middleware.mjs";

const router = Router();

// Example route for user authentication

router.post("/login", loginUser);
router.get("/verify", authMiddleware, verifyUser);


export default router;