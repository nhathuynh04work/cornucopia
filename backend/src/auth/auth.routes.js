import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";
import passport from "../config/passport.js";
import { env } from "../config/env.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
	confirmEmailSchema,
	loginSchema,
	signupSchema,
} from "./auth.schema.js";

const router = Router();

router.post("/signup", validate(signupSchema), authController.signup);

router.post("/login", validate(loginSchema), authController.localLogin);

router.get(
	"/confirm",
	validate(confirmEmailSchema),
	authController.confirmEmail
);

router.get("/me", authenticateJwt, authController.getCurrentUser);

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
	authController.googleCallback
);

export default router;
