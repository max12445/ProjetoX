import express from "express";
import {
  createOrder,
  getOrders,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/OrderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/usuario/:userId", getOrdersByUser);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;