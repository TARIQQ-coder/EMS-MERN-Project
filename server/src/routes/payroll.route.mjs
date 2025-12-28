import { processPayroll } from "../controllers/payroll.Controller.mjs";
import { Router } from "express";

const router = Router();

router.post("/process", processPayroll);

export default router;