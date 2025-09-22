export async function createLocalAuth(client, { userId, passwordHash }) {
	return client.query(
		"INSERT INTO authentication (user_id, password_hash, provider, provider_id) VALUES ($1, $2, $3, $4)",
		[userId, passwordHash, "local", null]
	);
}
