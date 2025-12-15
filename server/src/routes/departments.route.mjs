import { Router } from "express";
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "../controllers/departments.controller.mjs";
import { authMiddleware } from "../middleware/auth.middleware.mjs";


const router = Router();


router.get("/", authMiddleware, getDepartments);
router.post("/", authMiddleware, createDepartment);
router.put("/:id", authMiddleware, updateDepartment);
router.delete("/:id", authMiddleware, deleteDepartment);

export default router;