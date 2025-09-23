import db from "../db/db.js";

export async function getUserByEmail(email) {
	const result = await db.query(
		"SELECT * FROM users WHERE email = $1 LIMIT 1",
		[email]
	);
	return result.rows[0] || null;
}

export async function getUserById(id) {
	const result = await db.query(
		"SELECT id, name, email, is_active, created_at FROM users WHERE id = $1",
		[id]
	);
	return result.rows[0] || null;
}

export async function createUser(client, { name, email }) {
	const result = await client.query(
		"INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
		[name, email]
	);
	return result.rows[0];
}

export async function activateUser(client, { userId }) {
	await client.query("UPDATE users SET is_active = TRUE WHERE id = $1", [
		userId,
	]);
}
