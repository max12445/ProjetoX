import express from "express";
import {
  getProducts,
  getPendingProducts,
  getProductById,
  createProduct,
  updateProductStatus,
  deleteProduct,
} from "../controllers/ProductController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/pendentes", authMiddleware, requireRole("admin"), getPendingProducts);
router.post("/", authMiddleware, requireRole("admin", "comerciante"), createProduct);
router.get("/:id", getProductById);
router.patch("/:id/status", authMiddleware, requireRole("admin"), updateProductStatus);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteProduct);

export default router;
