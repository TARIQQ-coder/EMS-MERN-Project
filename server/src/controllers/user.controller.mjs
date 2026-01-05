import User from "../models/User.js";
import bcrypt from "bcrypt";
import { logActivity } from "../utils/logger.mjs"; // We'll create this next

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("department", "name")
      .select("-password")
      .sort({ name: 1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// CREATE user
export const createUser = async (req, res) => {
  const { name, email, role = "Employee", department, password } = req.body;

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      department: department || null,
    });

    // After creating a user
await logActivity({
  req,
  action: "user_created",
  targetUser: newUser._id,
  targetName: newUser.name,
  details: `Created ${newUser.role} user: ${newUser.email}`,
});

    const populated = await User.findById(user._id)
      .populate("department", "name")
      .select("-password");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

// UPDATE user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email.toLowerCase();
    if (req.body.role) user.role = req.body.role;
    if (req.body.department !== undefined) user.department = req.body.department || null;

    await user.save();

    await logActivity({
      req,
      action: "user_updated",
      targetUser: user._id,
      targetName: user.name,
      details: "Updated user profile",
    });

    const populated = await User.findById(user._id)
      .populate("department", "name")
      .select("-password");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();

    await logActivity({
      req,
      action: "user_deleted",
      targetUser: user._id,
      targetName: user.name,
      details: "Deleted user",
    });

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await logActivity({
      req,
      action: "password_reset_requested",
      targetUser: user._id,
      targetName: user.name,
      details: "Password reset requested",
    });

    // In real app: send email
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

// TOGGLE STATUS
export const toggleStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "Active" ? "Inactive" : "Active";
    await user.save();

    await logActivity({
      req,
      action: "user_status_toggled",
      targetUser: user._id,
      targetName: user.name,
      details: `Status changed to ${user.status}`,
    });

    const populated = await User.findById(user._id)
      .populate("department", "name")
      .select("-password");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Error toggling status" });
  }
};