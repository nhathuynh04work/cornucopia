import db from "../config/db.js";
import bcrypt from "bcrypt";

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

		await client.query("COMMIT");
		res.status(201).json({ message: "User registered successfully" });
	} catch (err) {
		await client.query("ROLLBACK");
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	} finally {
		client.release();
	}
};

export const localLogin = (req, res) => {
	res.send("Login endpoint");
};
