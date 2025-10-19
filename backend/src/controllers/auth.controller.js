import { env } from "../config/env.js";
import * as authService from "../services/auth.service.js";
import { createJWT } from "../utils/jwt.js";

// Local Signup
export async function signup(req, res) {
	await authService.localSignup(req.body);
	res.status(201).json({ message: "Confirmation email sent!" });
}

// Email Confirmation
export async function confirmEmail(req, res) {
	const token = await authService.confirmEmail(req.query.token);
	return res.status(201).json({ token });
}

// Get Current User
export async function getCurrentUser(req, res) {
	const id = req.user.id;
	const user = await authService.getCurrentUser(id);
	res.status(200).json({ user });
}

// Local Login
export async function localLogin(req, res) {
	const token = await authService.localLogin(req.body);
	res.status(201).json({ token });
}

// Google callback
export async function googleCallback(req, res) {
	const user = req.user;
	const token = createJWT({ sub: user.id, email: user.email });
	res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${token}`);
}
