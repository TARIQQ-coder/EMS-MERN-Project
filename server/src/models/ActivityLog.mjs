// src/models/ActivityLog.js
import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  actorName: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      "login",
      "user_created",
      "user_updated",
      "user_deleted",
      "user_status_toggled",
      "password_reset_requested",
    ],
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  targetName: String,
  details: String,
  ipAddress: String,
}, { timestamps: true });

// Index for fast sorting
activityLogSchema.index({ createdAt: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);