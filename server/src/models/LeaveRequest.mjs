import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    type: {
      type: String,
      enum: ["Annual", "Sick", "Casual", "Maternity", "Paternity", "Bereavement", "Unpaid", "Other"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    daysRequested: { type: Number, required: true, min: 1 },
    reason: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // Admin/Manager who approves
      default: null,
    },
    appliedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-calculate daysRequested
leaveRequestSchema.pre("save", function (next) {
  if (this.isModified("startDate") || this.isModified("endDate")) {
    const diffTime = Math.abs(new Date(this.endDate) - new Date(this.startDate));
    this.daysRequested = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("LeaveRequest", leaveRequestSchema);