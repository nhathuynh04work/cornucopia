import prisma from "../prisma.js";

// Config
const MIN_SCORE = 0.05;

// ===== Topic helpers =====
export async function findTopicIdsBySlugs(slugs = []) {
  if (!slugs?.length) return [];
  const rows = await prisma.topic.findMany({
    where: { slug: { in: slugs.map((s) => String(s).toLowerCase()) } },
    select: { id: true },
  });
  return rows.map((r) => r.id);
}

export async function findTopicIdsByTokens(tokens = []) {
  if (!tokens?.length) return [];
  const pats = tokens.map((t) => `%${t}%`);
  const rows = await prisma.$queryRawUnsafe(
    `SELECT id FROM topics WHERE unaccent(slug) ILIKE ANY($1) OR unaccent(name) ILIKE ANY($1) LIMIT 20;`,
    pats
  );
  return (rows || []).map((r) => r.id);
}

// ===== Chunks CRUD =====
export async function deleteChunksByPost(postId, client = prisma) {
  await client.postChunk.deleteMany({ where: { postId: Number(postId) } });
}

export async function insertChunk(postId, content, client = prisma) {
  await client.$executeRawUnsafe(
    `INSERT INTO post_chunks (post_id, content) VALUES ($1, $2);`,
    Number(postId),
    String(content || "")
  );
}

// ===== Search (DB only) =====
function topicSQL(topicIds) {
  return topicIds?.length
    ? `AND EXISTS (SELECT 1 FROM post_topics pt WHERE pt.post_id = pc.post_id AND pt.topic_id = ANY($3))`
    : ``;
}

/** Chuẩn SELECT + score + headline */
function selectCols() {
  return `
    pc.id, pc.post_id, pc.content,
    (
      ts_rank(pc.tsv, websearch_to_tsquery('simple', unaccent($1)))
      + CASE WHEN unaccent(pc.content) ILIKE '%'||unaccent($1)||'%' THEN 0.05 ELSE 0 END
      + CASE WHEN unaccent(p.title)   ILIKE '%'||unaccent($1)||'%' THEN 0.08 ELSE 0 END
     -- NEGATIVE BOOST chống quảng cáo / lộ trình / cam kết
     - CASE WHEN unaccent(pc.content) ILIKE '%lộ trình%' THEN 0.20 ELSE 0 END
     - CASE WHEN unaccent(pc.content) ILIKE '%khoá học%' THEN 0.20 ELSE 0 END
     - CASE WHEN unaccent(pc.content) ILIKE '%combo%' THEN 0.20 ELSE 0 END
     - CASE WHEN unaccent(pc.content) ILIKE '%cambridge%' THEN 0.12 ELSE 0 END
     - CASE WHEN unaccent(pc.content) ILIKE '%study4%' THEN 0.12 ELSE 0 END
    ) AS score,
    ts_headline(
      'simple',
      pc.content,
      websearch_to_tsquery('simple', unaccent($1)),
      'StartSel="", StopSel="", MaxFragments=2, MinWords=6, MaxWords=18'
    ) AS fragment,
    p.title, p.slug
  `;
}

function normalize(rows = []) {
  return rows
    .filter((r) => Number(r.score) >= MIN_SCORE)
    .map((r) => ({
      postId: r.post_id,
      title: r.title ?? "(Không có tiêu đề)",
      slug: r.slug ?? null,
      content: String(r.content || ""),
      fragment: String(r.fragment || ""),
      score: Number(r.score || 0),
    }))
    .sort((a, b) => b.score - a.score);
}

/** 1) Full-text chính */
export async function searchChunksFT(query, limit, topicIds = []) {
  const rows = await prisma.$queryRawUnsafe(
    `
    SELECT ${selectCols()}
    FROM post_chunks pc JOIN posts p ON p.id = pc.post_id
    WHERE pc.tsv @@ websearch_to_tsquery('simple', unaccent($1))
    ${topicSQL(topicIds)}
    ORDER BY score DESC, pc.id DESC
    LIMIT $2;
    `,
    ...(topicIds.length ? [query, limit, topicIds] : [query, limit])
  );
  return normalize(rows);
}

/** 2) Full-text OR tokens (nới lỏng) */
export async function searchChunksFT_OR(tokens = [], limit, topicIds = []) {
  const orQ = tokens.join(" OR ");
  const rows = await prisma.$queryRawUnsafe(
    `
    SELECT ${selectCols()}
    FROM post_chunks pc JOIN posts p ON p.id = pc.post_id
    WHERE pc.tsv @@ websearch_to_tsquery('simple', unaccent($1))
    ${topicSQL(topicIds)}
    ORDER BY score DESC, pc.id DESC
    LIMIT $2;
    `,
    ...(topicIds.length ? [orQ, limit, topicIds] : [orQ, limit])
  );
  return normalize(rows);
}

/** 3) Fallback ILIKE an toàn (>=2 token & cùng post có >=2 chunk khớp) */
export async function searchChunksILIKE(patterns = [], limit, topicIds = []) {
  const rows = await prisma.$queryRawUnsafe(
    `
    WITH hit AS (
      SELECT
        pc.id, pc.post_id, pc.content,
        (
          (SELECT COUNT(*) FROM unnest($1::text[]) tok WHERE unaccent(pc.content) ILIKE tok)*0.02
        + (SELECT COUNT(*) FROM unnest($1::text[]) tok WHERE unaccent(p.title)   ILIKE tok)*0.03
        ) AS score,
        NULL::text AS fragment,
        p.title, p.slug
      FROM post_chunks pc JOIN posts p ON p.id = pc.post_id
      WHERE EXISTS (SELECT 1 FROM unnest($1::text[]) tok WHERE unaccent(pc.content) ILIKE tok)
         OR EXISTS (SELECT 1 FROM unnest($1::text[]) tok WHERE unaccent(p.title)   ILIKE tok)
      ${topicSQL(topicIds)}
    ),
    agg AS (SELECT post_id FROM hit GROUP BY post_id HAVING COUNT(*) >= 2)
    SELECT h.* FROM hit h JOIN agg a ON a.post_id = h.post_id
    ORDER BY h.score DESC, h.id DESC
    LIMIT $2;
    `,
    ...(topicIds.length ? [patterns, limit, topicIds] : [patterns, limit])
  );
  return normalize(rows);
}
