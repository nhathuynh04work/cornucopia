import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASS,
	},
});

export async function sendConfirmationEmail(to, token) {
	const url = `${env.APP_BASE_URL}/confirm?token=${token}`;

	await transporter.sendMail({
		from: env.FROM_EMAIL,
		to,
		subject: "Confirm your email",
		html: `<p>Click <a href="${url}">here</a> to confirm your account.</p>`,
	});
}
