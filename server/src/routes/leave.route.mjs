// src/routes/leaveRoutes.js
import express from "express";
import {
  getLeaves,
  applyLeave,
  updateLeaveStatus,
} from "../controllers/leave.Controller.mjs";


const router = express.Router();


router.get("/", getLeaves);
router.post("/", applyLeave);
router.patch("/:id/status", updateLeaveStatus);



export default router;