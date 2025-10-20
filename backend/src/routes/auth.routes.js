import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import passport from "../config/passport.js";
import { env } from "../config/env.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateQueries } from "../middlewares/validateQueries.js";
import { LoginSchema, SignupSchema } from "../schemas/auth.schema.js";

const router = Router();

// local auth
router.post("/signup", validateSchema(SignupSchema), authController.signup);
router.post("/login", validateSchema(LoginSchema), authController.localLogin);
router.get("/confirm", validateQueries(["token"]), authController.confirmEmail);

// get current user
router.get("/me", authenticateJWT, authController.getCurrentUser);

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
	authController.googleCallback
);

export default router;
