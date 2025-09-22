import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/signup", authController.localSignup);
router.get("/confirm", authController.confirmEmail);
router.get("/me", authMiddleware, authController.getCurrentUser);
router.post("/login", authController.localLogin);

export default router;
