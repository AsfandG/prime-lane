import express from "express";
import { getUsers, loginUser, registerUser } from "../controllers/user.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", isAuthenticated, isAdmin, getUsers);

export default router;
