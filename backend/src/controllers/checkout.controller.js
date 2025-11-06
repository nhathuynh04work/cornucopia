import * as checkoutService from "../services/checkout.service.js";

export async function createCheckoutSession(req, res) {
	const courseId = req.params.courseId;
	const userId = req.user.id;

	const { url } = await checkoutService.createCheckoutSession({
		courseId,
		userId,
	});

	res.status(200).json({ url });
}

export async function handleStripeWebhook(req, res) {
	await checkoutService.handleStripeWebhook(
		req.body,
		req.headers["stripe-signature"]
	);

	res.status(200).json({ received: true });
}
