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

export async function getGoogleOAuthAccount(googleId) {
	const result = await db.query(
		"SELECT users.* FROM authentication JOIN users ON authentication.user_id = users.id WHERE provider = $1 AND provider_id = $2",
		["google", googleId]
	);
	return result.rows[0] || null;
}

export async function linkOAuthAccount(
	client,
	{ userId, provider, providerId }
) {
	return client.query(
		"INSERT INTO authentication (user_id, provider, provider_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
		[userId, provider, providerId]
	);
}
