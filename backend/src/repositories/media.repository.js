export async function uploadMedia(client, { userId, s3Key, fileType }) {
	// console.log("media.repo.js, uploadMedia");
	// console.log(userId, s3Key, fileType);

	const result = await client.query(
		"INSERT INTO media (user_id, s3_key, file_type) VALUES ($1, $2, $3) RETURNING *",
		[userId, s3Key, fileType]
	);

	return result.rows[0] || null;
}
