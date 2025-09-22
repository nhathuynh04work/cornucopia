export async function assignRoleToUser(client, { userId, role }) {
	return client.query(
		"INSERT INTO user_roles (user_id, role) VALUES ($1, $2)",
		[userId, role]
	);
}
