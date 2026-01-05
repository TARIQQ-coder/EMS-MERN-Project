import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  company: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    website: String,
    taxId: String,
    registrationNumber: String,
  },
  work: {
    workingDays: [String],
    startTime: String,
    endTime: String,
    breakDuration: String,
    overtimeRate: Number,
    lateArrivalGrace: String,
  },
  leave: {
    annualLeave: Number,
    sickLeave: Number,
    maternityLeave: Number,
    paternityLeave: Number,
    casualLeave: Number,
  },
  payroll: {
    currency: String,
    paymentCycle: String,
    paymentDay: String,
    taxRate: Number,
    socialSecurityRate: Number,
  },
  notifications: {
    emailNotifications: Boolean,
    leaveRequests: Boolean,
    newEmployees: Boolean,
    payrollReminders: Boolean,
    systemUpdates: Boolean,
  },
  security: {
    twoFactorAuth: Boolean,
    sessionTimeout: String,
    passwordExpiry: String,
    loginAttempts: String,
  },
}, { timestamps: true });

// Ensure only one settings document exists
settingsSchema.index({ _id: 1 }, { unique: true });

export default mongoose.model("Settings", settingsSchema);