import db from "../db/db.js";

export async function createLocalAuth(client, { userId, passwordHash }) {
	return client.query(
		"INSERT INTO authentication (user_id, password_hash, provider, provider_id) VALUES ($1, $2, $3, $4)",
		[userId, passwordHash, "local", null]
	);
}

export async function getLocalAuthByUserId(userId) {
	const result = await db.query(
		"SELECT * FROM authentication WHERE user_id = $1 AND provider = $2",
		[userId, "local"]
	);
	return result.rows[0] || null;
}
