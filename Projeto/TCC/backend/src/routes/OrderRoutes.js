import express from "express";
import {
  createOrder,
  getOrders,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/OrderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, requireRole("admin"), getOrders);
router.get("/usuario/:userId", authMiddleware, getOrdersByUser);
router.put("/:id", authMiddleware, requireRole("admin"), updateOrderStatus);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteOrder);

export default router;
