import db from "../db/db.js";

export async function assignRoleToUser(client, { userId, role }) {
	return client.query(
		"INSERT INTO user_roles (user_id, role) VALUES ($1, $2)",
		[userId, role]
	);
}

export async function getRoleByUserId(userId) {
	const result = await db.query(
		"SELECT role FROM user_roles WHERE user_id = $1",
		[userId]
	);

	return result.rows[0] || null;
}
