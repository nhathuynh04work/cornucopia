import { env } from "../config/env.js";
import { stripe } from "../config/stripe.js";
import prisma from "../prisma.js";
import { BadRequestError, NotFoundError } from "../utils/AppError.js";

const createCheckoutSession = async ({ courseId, userId }) => {
	const course = await prisma.course.findUnique({
		where: { id: courseId },
	});

	if (!course) {
		throw new NotFoundError("Course not found.");
	}

	const existingEnrollment = await prisma.userCourseEnrollment.findUnique({
		where: { userId_courseId: { userId, courseId } },
	});

	if (course.userId === userId) {
		throw new BadRequestError("You already own this course.");
	}

	if (existingEnrollment) {
		throw new BadRequestError("You are already enrolled in this course.");
	}

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		mode: "payment",
		client_reference_id: String(userId),
		metadata: {
			courseId: String(courseId),
		},
		success_url: `${env.FRONTEND_URL}/payment/callback?status=success&courseId=${courseId}`,
		cancel_url: `${env.FRONTEND_URL}/payment/callback?status=canceled&courseId=${courseId}`,
		line_items: [
			{
				price_data: {
					currency: "vnd",
					product_data: {
						name: course.name,
					},
					unit_amount: course.price,
				},
				quantity: 1,
			},
		],
	});

	return { url: session.url };
};

const handleStripeWebhook = async (rawBody, signature) => {
	let event;

	try {
		event = stripe.webhooks.constructEvent(
			rawBody,
			signature,
			env.STRIPE_WEBHOOK_SECRET
		);
	} catch (err) {
		throw new BadRequestError(`Webhook Error: ${err.message}`);
	}

	if (event.type === "checkout.session.completed") {
		const session = event.data.object;

		const userId = parseInt(session.client_reference_id, 10);
		const courseId = parseInt(session.metadata.courseId, 10);

		if (!userId || !courseId) {
			throw new BadRequestError("Missing userId or courseId in webhook.");
		}

		await fulfillOrder(userId, courseId);
	}

	return;
};

async function fulfillOrder(userId, courseId) {
	await prisma.userCourseEnrollment.upsert({
		where: {
			userId_courseId: {
				userId: userId,
				courseId: courseId,
			},
		},
		update: {},
		create: {
			userId: userId,
			courseId: courseId,
		},
	});
}

export const checkoutService = {
	createCheckoutSession,
	handleStripeWebhook,
};
