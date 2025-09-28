import db from "../db/db.js";

// Danh sách post có phân trang + lọc theo topicId + search q
export async function paginatePosts({ page = 1, pageSize = 10, topicId, q }) {
  const limit = Math.min(Number(pageSize) || 10, 50);
  const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

  const params = [];
  let where = `p.status = 'published'`;
  if (topicId) {
    params.push(topicId);
    where += ` AND p.topic_id = $${params.length}`;
  }
  if (q) {
    params.push(`%${q}%`);
    where += ` AND (p.title ILIKE $${params.length} OR p.content ILIKE $${params.length})`;
  }

  const base = `
    FROM posts p
    JOIN topics t ON t.id = p.topic_id
    JOIN users  u ON u.id = p.author_id
    WHERE ${where}
  `;

  const listSql = `
    SELECT p.id, p.title, p.slug, p.published_at, p.created_at,
           LEFT(REGEXP_REPLACE(p.content, '<[^>]*>', '', 'g'), 160) AS content_preview,
           t.id AS topic_id, t.name AS topic_name, t.slug AS topic_slug,
           u.name AS author_name, u.avatar_url AS author_avatar
    ${base}
    ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
    LIMIT ${limit} OFFSET ${offset};
  `;
  const countSql = `SELECT COUNT(*) ${base};`;

  const [listRes, countRes] = await Promise.all([
    db.query(listSql, params),
    db.query(countSql, params),
  ]);

  return {
    items: listRes.rows,
    total: Number(countRes.rows[0].count),
    page: Number(page) || 1,
    pageSize: limit,
  };
}

// Lấy chi tiết bài theo slug (chỉ trả bài đã publish)
export async function getPostBySlug(slug) {
  const sql = `
    SELECT p.id, p.title, p.slug, p.content, p.status,
           p.published_at, p.created_at,
           t.id AS topic_id, t.name AS topic_name, t.slug AS topic_slug,
           u.id AS author_id, u.name AS author_name, u.avatar_url AS author_avatar
    FROM posts p
    JOIN topics t ON t.id = p.topic_id
    JOIN users  u ON u.id = p.author_id
    WHERE p.slug = $1
    LIMIT 1;
  `;
  const { rows } = await db.query(sql, [slug]);
  const post = rows[0];
  if (!post) return null;
  if (post.status !== "published") return null;
  return post;
}
