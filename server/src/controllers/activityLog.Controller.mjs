import ActivityLog from "../models/ActivityLog.mjs";

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("actor", "name email")
      .populate("targetUser", "name email")
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs" });
  }
};