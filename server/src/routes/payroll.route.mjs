import { processPayroll } from "../controllers/payroll.Controller.mjs";
import { emailPayslips } from "../controllers/payroll.Controller.mjs";
import { Router } from "express";

const router = Router();

router.post("/process", processPayroll);
router.post("/email-payslips", emailPayslips);

export default router;