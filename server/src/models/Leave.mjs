// src/models/Leave.js
import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  type: {
    type: String,
    enum: ["Sick", "Casual", "Annual", "Maternity", "Other"],
    required: true,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: {
    type: Date,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
});

// Virtual to calculate days if needed (optional)
leaveSchema.virtual("duration").get(function () {
  const diff = Math.abs(this.to - this.from);
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
});

export default mongoose.model("Leave", leaveSchema);