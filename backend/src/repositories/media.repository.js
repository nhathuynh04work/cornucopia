export async function uploadMedia(client, { userId, fileUrl, fileType }) {
	console.log("media.repo.js, uploadMedia");
	console.log(userId, fileUrl, fileType);

	const result = client.query(
		"INSERT INTO media (user_id, file_url, file_type) VALUES ($1, $2, $3) RETURNING *",
		[userId, fileUrl, fileType]
	);

	return result.rows[0] || null;
}
