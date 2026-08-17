import express from "express";
import {
  getProducts,
  getPendingProducts,
  getProductById,
  createProduct,
  updateProductStatus,
  deleteProduct,
} from "../controllers/ProductController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/pendentes", getPendingProducts); 
router.get("/:id", getProductById);
router.post("/", createProduct);
router.patch("/:id/status", updateProductStatus);
router.delete("/:id", deleteProduct);

export default router;