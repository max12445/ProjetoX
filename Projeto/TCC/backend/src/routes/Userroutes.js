import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", authMiddleware, requireRole("admin"), getUsers);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteUser);

export default router;
