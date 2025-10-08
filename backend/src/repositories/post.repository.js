// export async function createPost(client, { slug, title, content, authorId }) {
//   const res = await client.query(
//     `
//     INSERT INTO posts (author_id, title, slug, content, status, published_at)
//     VALUES ($1,$2,$3,$4,$5,$6)
//     RETURNING *
//   `,
//     [authorId, title, slug, content, "draft", null]
//   );

//   return res.rows[0];
// }

// export async function getPostById(client, { id }) {
//   const res = await client.query("SELECT * FROM posts WHERE id = $1", [id]);
//   return res.rows[0];
// }
// export async function getAllPosts(client) {
//   const res = await client.query(
//     "SELECT * FROM posts ORDER BY created_at DESC"
//   );
//   return res.rows;
// }

export async function createPost(
  client,
  { slug, title, content, authorId, topicId = null, coverUrl = null }
) {
  const res = await client.query(
    `
    INSERT INTO posts (author_id, title, slug, content, status, published_at, topic_id, cover_url)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
  `,
    [authorId, title, slug, content, "draft", null, topicId, coverUrl]
  );
  return res.rows[0];
}

export async function getPostById(client, { id }) {
  const res = await client.query(
    `
    SELECT 
      p.*,
      u.name AS author_name,
      t.name AS topic_name, 
      t.slug AS topic_slug
    FROM posts p
    LEFT JOIN users u  ON u.id = p.author_id
    LEFT JOIN topics t ON t.id = p.topic_id
    WHERE p.id = $1
    `,
    [id]
  );
  return res.rows[0];
}

export async function getAllPosts(client) {
  const res = await client.query(`
    SELECT 
      p.id, p.title, p.slug, p.content, p.status, 
      p.published_at, p.created_at, p.cover_url,
      u.id   AS author_id,
      COALESCE(u.name, split_part(u.email,'@',1)) AS author_name,
      t.id   AS topic_id,
      t.name AS topic_name,
      t.slug AS topic_slug
    FROM posts p
    LEFT JOIN users  u ON u.id = p.author_id
    LEFT JOIN topics t ON t.id = p.topic_id
    ORDER BY COALESCE(p.published_at, p.created_at) DESC
  `);
  return res.rows;
}

export async function deletePostById(client, { id }) {
  const { rows } = await client.query(
    "DELETE FROM posts WHERE id = $1 RETURNING id",
    [id]
  );
  return rows.length > 0 ? rows[0].id : null;
}

export async function updatePostById(
  client,
  { id, title, content, status, coverUrl = null, topicId = null }
) {
  const { rows } = await client.query(
    `
    UPDATE posts
    SET
      title       = $2,
      content     = $3,
      status      = $4::varchar,         -- ép về varchar(20)
      cover_url   = $5,
      topic_id    = $6,
      published_at = CASE
        WHEN $4::varchar = 'published' AND published_at IS NULL THEN now()
        WHEN $4::varchar <> 'published' THEN NULL
        ELSE published_at
      END
    WHERE id = $1
    RETURNING *;
    `,
    [id, title, content, status, coverUrl, topicId]
  );
  return rows[0] || null;
}

export async function getPostsByTopicSlug(
  client,
  { slug, offset = 0, limit = 50 }
) {
  const { rows } = await client.query(
    `
    SELECT 
      p.id, p.title, p.slug, p.content, p.status,
      p.published_at, p.created_at, p.cover_url,
      u.id   AS author_id,
      COALESCE(u.name, split_part(u.email,'@',1)) AS author_name,
      t.id   AS topic_id,
      t.name AS topic_name,
      t.slug AS topic_slug
    FROM posts p
    LEFT JOIN users  u ON u.id = p.author_id
    LEFT JOIN topics t ON t.id = p.topic_id
    WHERE t.slug = $1
    ORDER BY COALESCE(p.published_at, p.created_at) DESC
    OFFSET $2 LIMIT $3
    `,
    [slug, offset, limit]
  );
  return rows;
}
