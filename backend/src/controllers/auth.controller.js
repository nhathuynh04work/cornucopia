import db from "../config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendConfirmationEmail } from "../services/email.js";

// Local Signup
export const localSignup = async (req, res) => {
	const { name, email, password } = req.body;

	// Check required fields
	if (!name || !email || !password) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	// Check if user exists
	const existingUser = await db.query(
		"SELECT id FROM users WHERE email = $1",
		[email]
	);

	if (existingUser.rows.length > 0) {
		return res
			.status(400)
			.json({ error: "User with this email already exists" });
	}

	// Insert user, authentication, and authorization in a transaction
	const client = await db.connect();
	try {
		await client.query("BEGIN");

		// Insert into users
		const userResult = await client.query(
			"INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id",
			[name, email]
		);
		const userId = userResult.rows[0].id;

		// Hash password
		const passwordHash = await bcrypt.hash(password, 10);

		// Insert into authentication
		await client.query(
			"INSERT INTO authentication (user_id, password_hash, provider, provider_id) VALUES ($1, $2, $3, $4)",
			[userId, passwordHash, "local", null]
		);

		// Insert into user_roles (authorization)
		await client.query(
			"INSERT INTO user_roles (user_id, role) VALUES ($1, $2)",
			[userId, "user"]
		);

		// Generate email verification token
		const token = crypto.randomBytes(32).toString("hex");
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

		// Insert token into email_verification_tokens
		await client.query(
			"INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
			[userId, token, expiresAt]
		);

		// Send email with verification link
		await sendConfirmationEmail(email, token);

		await client.query("COMMIT");
		res.status(201).json({ message: "Confirmation email send" });
	} catch (err) {
		await client.query("ROLLBACK");
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	} finally {
		client.release();
	}
};

// Email confirmation
export const confirmEmail = async (req, res) => {
	const { token } = req.query;

	if (!token) {
		return res.status(400).json({ error: "Missing token" });
	}

	try {
		// Find the token
		const tokenResult = await db.query(
			"SELECT user_id, expires_at FROM email_verification_tokens WHERE token = $1",
			[token]
		);

		if (tokenResult.rows.length === 0) {
			return res.status(400).json({ error: "Invalid token" });
		}

		const { user_id, expires_at } = tokenResult.rows[0];

		// Check if token is expired
		if (new Date() > expires_at) {
			return res.status(400).json({ error: "Token has expired" });
		}

		// Update user's is_active status
		await db.query("UPDATE users SET is_active = TRUE WHERE id = $1", [
			user_id,
		]);

		// Delete the token
		await db.query(
			"DELETE FROM email_verification_tokens WHERE token = $1",
			[token]
		);

		res.json({ message: "Email confirmed successfully" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const localLogin = (req, res) => {
	res.send("Login endpoint");
};
