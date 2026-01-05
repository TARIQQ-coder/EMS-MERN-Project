// src/utils/logger.js
import ActivityLog from "../models/ActivityLog.mjs";

export const logActivity = async ({ req, action, targetUser = null, targetName = "", details = "" }) => {
  try {
    const actorId = req.user?.id || req.user?._id;
    const actorName = req.user?.name || "Unknown";

    await ActivityLog.create({
      actor: actorId,
      actorName,
      action,
      targetUser,
      targetName,
      details,
      ipAddress: req.ip || req.connection.remoteAddress,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Don't throw — logging should never break the main operation
  }
};