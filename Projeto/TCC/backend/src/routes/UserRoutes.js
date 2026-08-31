import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  updateUser,
  deleteUser,
  logoutUser,
} from "../controllers/UserController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { validate, registerSchema, loginSchema, updateUserSchema } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.get("/", authMiddleware, requireRole("admin"), getUsers);
router.put("/:id", authMiddleware, validate(updateUserSchema), updateUser);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteUser);

export default router;
