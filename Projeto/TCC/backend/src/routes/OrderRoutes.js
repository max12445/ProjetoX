import express from "express";
import {
  createOrder,
  getOrders,
  getOrdersByUser,
  getMerchantOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/OrderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  validate,
  createOrderSchema,
  updateOrderStatusSchema,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, validate(createOrderSchema), createOrder);
router.get("/", authMiddleware, requireRole("admin"), getOrders);
router.get("/comerciante", authMiddleware, requireRole("comerciante", "admin"), getMerchantOrders);
router.get("/usuario/:userId", authMiddleware, getOrdersByUser);
router.put("/:id", authMiddleware, requireRole("admin"), validate(updateOrderStatusSchema), updateOrderStatus);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteOrder);

export default router;
