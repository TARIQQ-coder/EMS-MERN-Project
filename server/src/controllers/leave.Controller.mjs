import LeaveRequest from "../models/LeaveRequest.mjs";

// Get all leaves (for admin) or filtered by employee (future employee dashboard)
export const getLeaves = async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    const filter = {};

    // If employeeId is provided, only show that employee's leaves (for future employee view)
    if (employeeId) filter.employee = employeeId;
    if (status) filter.status = status;

    const leaves = await LeaveRequest.find(filter)
      .populate("employee", "name email department role")
      .populate("approvedBy", "name")
      .sort({ appliedAt: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single leave request (usable by both admin and employee)
export const getLeaveById = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id)
      .populate("employee", "name email")
      .populate("approvedBy", "name");

    if (!leave) return res.status(404).json({ message: "Leave not found" });

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create leave request (will be used by both admin and employees later)
export const createLeave = async (req, res) => {
  const { employee, type, startDate, endDate, reason } = req.body;

  try {
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const leave = await LeaveRequest.create({
      employee,
      type,
      startDate,
      endDate,
      reason,
    });

    await leave.populate("employee", "name email");

    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update leave status (approve/reject/cancel) - Admin only for now
export const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    // Only allow valid status changes
    if (!["Approved", "Rejected", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    leave.status = status;
    leave.approvedBy = req.user?.id; // Assuming you have auth middleware with user
    await leave.save();

    await leave.populate("employee", "name email");
    await leave.populate("approvedBy", "name");

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete leave (admin only, or employee can cancel their own pending)
export const deleteLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    await leave.deleteOne();
    res.json({ message: "Leave request deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};