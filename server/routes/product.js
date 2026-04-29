import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/product.js";

const router = express.Router();

router.route("/").get(getProducts).post(isAuthenticated, isAdmin, createProduct);
router.route("/:id").get(getProduct).put(isAuthenticated, isAdmin, updateProduct).delete(isAuthenticated, isAdmin, deleteProduct);

export default router;
