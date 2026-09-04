import express from "express";
import {
  createSupportMessage,
  getSupportMessages,
  updateSupportMessageStatus,
} from "../controllers/SupportController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  validate,
  createSupportMessageSchema,
  updateSupportStatusSchema,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/", validate(createSupportMessageSchema), createSupportMessage);
router.get("/", authMiddleware, requireRole("admin"), getSupportMessages);
router.patch(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  validate(updateSupportStatusSchema),
  updateSupportMessageStatus
);

export default router;