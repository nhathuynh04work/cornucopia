import { env } from "../config/env.js";
import { authService } from "./auth.service.js";
import { createJWT } from "../utils/jwt.js";

const signup = async (req, res) => {
	await authService.localSignup(req.body);
	res.status(201).json({ message: "Confirmation email sent!" });
};

const confirmEmail = async (req, res) => {
	const token = await authService.confirmEmail(req.query.token);
	return res.status(201).json({ token });
};

const getCurrentUser = async (req, res) => {
	const id = req.user.id;
	const user = await authService.getCurrentUser(id);
	res.status(200).json({ user });
};

const localLogin = async (req, res) => {
	const token = await authService.localLogin(req.body);
	res.status(201).json({ token });
};

const googleCallback = async (req, res) => {
	const user = req.user;

	if (user.isBlocked) {
		return res.redirect(`${env.FRONTEND_URL}/login?error=blocked`);
	}

	const token = createJWT({
		sub: user.id,
		email: user.email,
		role: user.role,
	});
	res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${token}`);
};

export const authController = {
	signup,
	confirmEmail,
	getCurrentUser,
	localLogin,
	googleCallback,
};
