import db from "../db/db.js";
import bcrypt from "bcrypt";
import { createJWT } from "../utils/jwt.js";
import { confirmEmail, localSignup } from "../services/auth.service.js";

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
export const getCurrentUser = async (req, res) => {
	const userId = req.user.userId;

	try {
		// Fetch user details
		const userResult = await db.query(
			"SELECT id, name, email, is_active, created_at FROM users WHERE id = $1",
			[userId]
		);

		if (userResult.rows.length === 0) {
			return res.status(404).json({ error: "User not found" });
		}

		// Get user roles
		const rolesResult = await db.query(
			"SELECT role FROM user_roles WHERE user_id = $1",
			[userId]
		);

		const user = {
			...userResult.rows[0],
			roles: rolesResult.rows.map((r) => r.role),
		};

		res.json({ user });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Local Login
export const localLogin = async (req, res) => {
	const { email, password } = req.body;

	// Validate input
	if (!email || !password) {
		return res.status(400).json({ error: "Missing email or password" });
	}

	try {
		// Find user
		const userResult = await db.query(
			"SELECT id, email, name, is_active FROM users WHERE email = $1",
			[email]
		);

		if (userResult.rows.length === 0) {
			return res.status(400).json({ error: "Invalid email or password" });
		}

		const user = userResult.rows[0];

		// Check if active (email confirmed)
		if (!user.is_active) {
			return res
				.status(403)
				.json({ error: "Please confirm your email before logging in" });
		}

		// Get password hash from authentication table
		const authResult = await db.query(
			"SELECT password_hash FROM authentication WHERE user_id = $1 AND provider = $2",
			[user.id, "local"]
		);

		if (authResult.rows.length === 0) {
			return res.status(400).json({ error: "Invalid email or password" });
		}

		const { password_hash } = authResult.rows[0];

		// Compare password
		const isMatch = await bcrypt.compare(password, password_hash);
		if (!isMatch) {
			return res.status(400).json({ error: "Invalid email or password" });
		}

		// ✅ Just return the JWT (frontend will decode or call /me endpoint later)
		const jwtToken = createJWT({ userId: user.id });

		res.json({
			message: "Login successful",
			token: jwtToken,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};
