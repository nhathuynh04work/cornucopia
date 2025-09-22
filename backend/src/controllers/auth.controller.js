import db from "../config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendConfirmationEmail } from "../services/email.js";
import { createJWT } from "../services/jwt.js";

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

// Email Confirmation
export const confirmEmail = async (req, res) => {
	const { token } = req.query;
	if (!token) return res.status(400).json({ error: "Missing token" });

	const client = await db.connect();
	try {
		await client.query("BEGIN");

		// Retrieve token info
		const tokenResult = await client.query(
			"SELECT user_id, expires_at FROM email_verification_tokens WHERE token = $1",
			[token]
		);

		// Invalid token
		if (tokenResult.rows.length === 0) {
			await client.query("ROLLBACK");
			return res.status(400).json({ error: "Not found token" });
		}

		const { user_id, expires_at } = tokenResult.rows[0];

		// Expired token, remove it
		if (new Date() > expires_at) {
			await client.query(
				"DELETE FROM email_verification_tokens WHERE token = $1",
				[token]
			);
			await client.query("ROLLBACK");
			return res.status(400).json({ error: "Token has expired" });
		}

		// Activate user and remove token
		await client.query("UPDATE users SET is_active = TRUE WHERE id = $1", [
			user_id,
		]);
		await client.query(
			"DELETE FROM email_verification_tokens WHERE token = $1",
			[token]
		);

		await client.query("COMMIT");

		// Create JWT for immediate login
		const jwtToken = createJWT({ userId: user_id });
		res.json({ message: "Email confirmed successfully", token: jwtToken });
	} catch (err) {
		await client.query("ROLLBACK");
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	} finally {
		client.release();
	}
};

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
