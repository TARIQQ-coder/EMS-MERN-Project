import { Router } from "express";
import { loginUser, verifyUser, logoutUser } from "../controllers/auth.controller.mjs";
import { authMiddleware } from "../middleware/auth.middleware.mjs";

const router = Router();

// Example route for user authentication

router.post("/login", loginUser);
router.get("/verify", authMiddleware, verifyUser);
router.post("/logout", authMiddleware, logoutUser);


export default router;