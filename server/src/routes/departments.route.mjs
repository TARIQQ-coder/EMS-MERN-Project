import { Router } from "express";
import { getDepartments, createDepartment, updateDepartment, deleteDepartment, getDepartmentById } from "../controllers/departments.controller.mjs";
import { authMiddleware } from "../middleware/auth.middleware.mjs";


const router = Router();


router.get("/", authMiddleware, getDepartments);
router.post("/", authMiddleware, createDepartment);
router.put("/:id", authMiddleware, updateDepartment);
router.get("/:id", authMiddleware, getDepartmentById);
router.delete("/:id", authMiddleware, deleteDepartment);

export default router;