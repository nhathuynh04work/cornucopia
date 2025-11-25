import { Router } from "express";
import express from "express";
import { checkoutController } from "./checkout.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createCheckoutSessionSchema } from "./checkout.schema.js";

const router = Router();

router.post(
	"/create-session/:courseId",
	authenticateJwt,
	validate(createCheckoutSessionSchema),
	checkoutController.createCheckoutSession
);

router.post(
	"/webhook",
	express.raw({ type: "application/json" }),
	checkoutController.handleStripeWebhook
);

export default router;
