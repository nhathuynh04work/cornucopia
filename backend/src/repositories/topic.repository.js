// Lấy danh sách topics kèm số bài đã publish
import db from "../db/db.js";

export async function listTopicsWithCount() {
  const sql = `
    SELECT t.id, t.name, t.slug, t.description,
           COUNT(p.*) FILTER (WHERE p.status = 'published') AS post_count
    FROM topics t
    LEFT JOIN posts p ON p.topic_id = t.id
    GROUP BY t.id
    ORDER BY t.name ASC;
  `;
  const { rows } = await db.query(sql);
  return rows;
}

export async function findTopicBySlug(slug) {
  const { rows } = await db.query(
    `SELECT id, name, slug, description FROM topics WHERE slug = $1 LIMIT 1`,
    [slug]
  );
  return rows[0] || null;
}
