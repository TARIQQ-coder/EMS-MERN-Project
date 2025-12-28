// src/models/Employee.mjs
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    // Your existing fields...
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    joinDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Active", "Suspended", "Resigned"],
      default: "Active",
    },

    // === NEW PAYROLL FIELDS ===
    baseSalary: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    bonus: {
      type: Number,
      min: 0,
      default: 0,
    },
    currency: {
      type: String,
      default: "GHS", // Ghanaian Cedi — change if needed
    },
    payFrequency: {
      type: String,
      enum: ["monthly", "bi-weekly", "weekly"],
      default: "monthly",
    },
    taxRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0, // % — for future deductions
    },
    lastPaidDate: {
      type: Date,
      default: null,
    },
    nextPayDate: {
      type: Date,
      default: null,
    },
    payrollNotes: {
      type: String,
      trim: true,
    },
    // ==========================

    // Your other existing fields (phone, address, etc.)
  },
  { timestamps: true }
);

// Virtual for total monthly pay
employeeSchema.virtual("totalMonthlyPay").get(function () {
  return this.baseSalary + this.bonus;
});

// Ensure virtuals are included in JSON
employeeSchema.set("toJSON", { virtuals: true });
employeeSchema.set("toObject", { virtuals: true });

export default mongoose.model("Employee", employeeSchema);