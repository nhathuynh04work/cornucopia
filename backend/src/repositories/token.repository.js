import db from "../db/db.js";

export async function createToken(client, { userId, token, expiresAt }) {
	return client.query(
		"INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
		[userId, token, expiresAt]
	);
}

export async function getTokenInfo(token) {
	const result = await db.query(
		"SELECT user_id, expires_at FROM email_verification_tokens WHERE token = $1",
		[token]
	);
	return result.rows[0] || null;
}

export async function deleteToken(client, token) {
	return client.query(
		"DELETE FROM email_verification_tokens WHERE token = $1",
		[token]
	);
}
