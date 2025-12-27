import express from "express";
import { getAttendance, clockIn, clockOut, updateAttendance } from "../controllers/attendance.Controller.mjs";

const router = express.Router();

router.get("/", getAttendance); // ?date=2025-12-26 for specific day
router.post("/clock-in", clockIn);
router.post("/clock-out", clockOut);
router.put("/:id", updateAttendance); // Admin manual override

export default router;