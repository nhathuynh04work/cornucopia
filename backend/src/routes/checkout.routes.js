import { Router } from "express";
import express from "express";
import * as checkoutController from "../controllers/checkout.controller.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { validateParams } from "../middlewares/validateParams.js";

const router = Router();

router.post(
	"/create-session/:courseId",
	authenticateJWT,
	validateParams(["courseId"]),
	checkoutController.createCheckoutSession
);

router.post(
	"/webhook",
	express.raw({ type: "application/json" }),
	checkoutController.handleStripeWebhook
);

export default router;
