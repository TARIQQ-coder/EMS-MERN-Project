import express from "express";
import {
  getLeaves,
  getLeaveById,
  createLeave,
  updateLeaveStatus,
  deleteLeave,
} from "../controllers/leave.Controller.mjs";

const router = express.Router();

// Admin routes (full access)
router.get("/", getLeaves);               // All leaves (with ?employeeId, ?status filters)
router.get("/:id", getLeaveById);
router.post("/", createLeave);            // Create (will be used by employee later too)
router.put("/:id/status", updateLeaveStatus); // Approve/Reject/Cancel
router.delete("/:id", deleteLeave);

// Future employee-specific routes (same endpoints, but filtered by auth middleware)
export default router;