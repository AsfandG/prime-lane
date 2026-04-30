import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";

import { upload } from "../middleware/upload.js";
import {
  createOrder,
  getOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/order.js";

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, isAdmin, getOrders)
  .post(isAuthenticated, createOrder);

router.route("/getUserOrders").get(isAuthenticated, getUserOrders);
router.route("/:id/status").put(isAuthenticated, isAdmin, updateOrderStatus);

export default router;
