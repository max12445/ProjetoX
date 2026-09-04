import express from "express";
import {
  getProducts,
  getCategories,
  getStores,
  getPendingProducts,
  getMyProducts,
  getProductById,
  getRecommendedProducts,
  getProductStore,
  createProduct,
  updateProduct,
  updateProductStatus,
  updateProductStock,
  deleteProduct,
} from "../controllers/ProductController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  validate,
  createProductSchema,
  updateProductSchema,
  updateProductStatusSchema,
  updateProductStockSchema,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/categorias", getCategories);
router.get("/lojas", getStores);
router.get("/pendentes", authMiddleware, requireRole("admin"), getPendingProducts);
router.get("/meus-produtos", authMiddleware, requireRole("comerciante", "admin"), getMyProducts);
router.post("/", authMiddleware, requireRole("admin", "comerciante"), validate(createProductSchema), createProduct);
router.get("/:id/recomendados", getRecommendedProducts);
router.get("/:id/loja", getProductStore);
router.get("/:id", getProductById);
router.patch("/:id/status", authMiddleware, requireRole("admin"), validate(updateProductStatusSchema), updateProductStatus);
router.patch("/:id/estoque", authMiddleware, requireRole("comerciante", "admin"), validate(updateProductStockSchema), updateProductStock);
router.patch("/:id", authMiddleware, requireRole("admin", "comerciante"), validate(updateProductSchema), updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;