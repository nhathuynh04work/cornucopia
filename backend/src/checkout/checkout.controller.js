import { checkoutService } from "./checkout.service.js";

const createCheckoutSession = async (req, res) => {
	const courseId = req.params.courseId;
	const userId = req.user.id;

	const { url } = await checkoutService.createCheckoutSession({
		courseId,
		userId,
	});

	res.status(200).json({ url });
};

const handleStripeWebhook = async (req, res) => {
	await checkoutService.handleStripeWebhook(
		req.body,
		req.headers["stripe-signature"]
	);

	res.status(200).json({ received: true });
};

export const checkoutController = {
	createCheckoutSession,
	handleStripeWebhook,
};
