// controllers/authController.js  (or wherever you keep it)
import User from "../models/User.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Same validation schema as your frontend — NEVER trust the client
const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password cannot be empty"),
});

export const loginUser = async (req, res) => {
  try {
    // 1. SERVER-SIDE VALIDATION (this is the real protection)
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      return res.status(400).json({
        success: false,
        message: firstError.message, // "Email is required", "Invalid email format", etc.
      });
    }

    const { email, password } = parsed.data;

    // 2. Find user (case-insensitive)
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Optional: Block deactivated accounts
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Account deactivated. Please contact HR.",
      });
    }

    // 4. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 5. Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15h" }
    );


    // Set token in HTTP-only cookie and sends in response to the browser automatically
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set to true if using HTTPS
      sameSite: "Lax", // adjust based on your frontend-backend setup
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })


    // 6. Success
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};


export const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      message: "User is authenticated",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Verify user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}


export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // set to true if using HTTPS
    sameSite: "Lax",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
}