import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/signup", authController.signupController);
router.get("/confirm", authController.confirmEmailController);
router.get("/me", authenticateJWT, authController.getCurrentUserController);
router.post("/login", authController.localLoginController);

export default router;
