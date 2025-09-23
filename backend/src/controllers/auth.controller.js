import {
	confirmEmail,
	getCurrentUser,
	localLogin,
	localSignup,
} from "../services/auth.service.js";

// Local Signup
export async function signupController(req, res) {
	const { email, name, password } = req.body;

	if (!email || !name || !password) {
		return res
			.status(400)
			.json({ error: "Name, email, and password required" });
	}

	try {
		const result = await localSignup({ email, name, password });
		res.status(result.status).json({ message: result.message });
	} catch (err) {
		console.error("Signup error:", err);

		const status = err.status || 500;
		const message = err.error || "Internal server error";

		res.status(status).json({ error: message });
	}
}

// Email Confirmation
export async function confirmEmailController(req, res) {
	const { token } = req.query;

	if (!token) {
		return res.status(400).json({ error: "Token is required" });
	}

	try {
		const result = await confirmEmail({ token });
		return res.status(result.status).json({
			message: result.message,
			token: result.token,
		});
	} catch (err) {
		console.error("Email confirmation error:", err);

		const status = err.status || 500;
		const message = err.error || "Internal server error";

		return res.status(status).json({ error: message });
	}
}

// Get Current User
export async function getCurrentUserController(req, res) {
	const userId = req.user.userId;

	try {
		const result = await getCurrentUser({ userId });

		res.status(result.status).json({
			message: result.message,
			user: result.user,
		});
	} catch (err) {
		console.error("Get current user error: " + err);

		const status = err.status || 500;
		const message = err.error || "Internal server error";

		res.status(status).json({ error: message });
	}
}

// Local Login
export async function localLoginController(req, res) {
	const { email, password } = req.body;

	// Validate input
	if (!email || !password) {
		return res.status(400).json({ error: "Missing email or password" });
	}

	try {
		const result = await localLogin({ email, password });

		res.status(result.status).json({
			message: result.message,
			token: result.token,
		});
	} catch (err) {
		console.error("Login error:", err);

		const status = err.status || 500;
		const message = err.error || "Internal server error";

		res.status(status).json({ error: message });
	}
}
