import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import passport from "../config/passport.js";
import { env } from "../config/env.js";

const router = Router();

// local auth
router.post("/signup", authController.signupController);
router.get("/confirm", authController.confirmEmailController);
router.post("/login", authController.localLoginController);

// get current user
router.get("/me", authenticateJWT, authController.getCurrentUserController);

// google oauth
router.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
	"/google/callback",
	passport.authenticate("google", {
		session: false,
		failureRedirect: `${env.FRONTEND_URL}/login`,
	}),
	authController.googleCallbackController
);

export default router;
