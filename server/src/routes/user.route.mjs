import { Router } from "express";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  toggleStatus,
} from "../controllers/user.controller.mjs";
import { authMiddleware, restrictTo } from "../middleware/auth.middleware.mjs";

const router = Router();

// Only admins can manage users
router.use(authMiddleware);
router.use(restrictTo("Admin"));

router.route("/")
  .get(getAllUsers)
  .post(createUser);

router.route("/:id")
  .patch(updateUser)
  .delete(deleteUser);

router.post("/:id/reset-password", resetPassword);
router.patch("/:id/status", toggleStatus);

export default router;