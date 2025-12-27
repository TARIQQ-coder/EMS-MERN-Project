import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      // Unique per employee per day
    },
    clockIn: {
      type: Date,
      default: null,
    },
    clockOut: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Present", "Late", "Absent", "On Leave", "Half Day", "Remote"],
      default: "Absent",
    },
    workHours: {
      type: Number, // in hours (e.g., 8.5)
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    location: {
      type: String, // Optional: "Office", "Remote", or coordinates
      default: "Office",
    },
  },
  { timestamps: true }
);

// Ensure one record per employee per day
// src/models/Attendance.mjs

attendanceSchema.pre("save", async function () {
  // Remove the 'next' parameter — use async/await instead
  try {
    // Recalculate workHours
    if (this.clockIn && this.clockOut) {
      const hours = (new Date(this.clockOut) - new Date(this.clockIn)) / (1000 * 60 * 60);
      this.workHours = parseFloat(hours.toFixed(2));
    } else {
      this.workHours = 0;
    }

    // Optional: Auto-set status based on clockIn time (customize as needed)
    if (this.clockIn && !this.isModified("status")) {
      const clockInHour = new Date(this.clockIn).getHours();
      this.status = clockInHour >= 9 ? "Late" : "Present"; // Example: late after 9 AM
    }

    // Normalize date to midnight
    if (this.date) {
      this.date = new Date(this.date.setHours(0, 0, 0, 0));
    }
  } catch (err) {
    console.error("Pre-save middleware error:", err);
    throw err; // Let Mongoose handle the error
  }
});

export default mongoose.model("Attendance", attendanceSchema);