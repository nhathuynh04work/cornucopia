import { Router } from "express";
import express from "express";
import * as checkoutController from "../controllers/checkout.controller.js";
import { validateParams } from "../middlewares/validateParams.js";
import { authenticateJwt } from "../middlewares/authenticateJwt.js";

const router = Router();

router.post(
	"/create-session/:courseId",
	authenticateJwt,
	validateParams(["courseId"]),
	checkoutController.createCheckoutSession
);

router.post(
	"/webhook",
	express.raw({ type: "application/json" }),
	checkoutController.handleStripeWebhook
);

export default router;
