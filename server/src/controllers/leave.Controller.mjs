// src/controllers/leaveController.js
import Leave from "../models/Leave.mjs";
import Employee from "../models/Employee.mjs";

// Get all leave requests (populated)
export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "name email")
      .populate("department", "name")
      .populate("reviewedBy", "name")
      .sort({ appliedAt: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Apply for leave
export const applyLeave = async (req, res) => {
  const { employee, type, from, to, reason, days } = req.body;

  try {
    const leave = await Leave.create({
      employee,
      department: (await Employee.findById(employee)).department, // auto-fill department
      type,
      from,
      to,
      days,
      reason,
    });

    await leave.populate("employee", "name email");
    await leave.populate("department", "name");

    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update leave status (Approve/Reject)
export const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;
  const validStatus = ["Approved", "Rejected"];

  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave request not found" });

    if (leave.status !== "Pending") {
      return res.status(400).json({ message: "Cannot update non-pending leave" });
    }

    leave.status = status;
    leave.reviewedAt = new Date();
    leave.reviewedBy = req.user.id; // from auth middleware

    await leave.save();
    await leave.populate("employee", "name email");
    await leave.populate("department", "name");
    await leave.populate("reviewedBy", "name");

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};