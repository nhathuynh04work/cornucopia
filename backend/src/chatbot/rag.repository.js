import prisma from "../prisma.js";
// Config
const MIN_SCORE = 0.05;

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
    p.title
  `;
}

function normalize(rows = []) {
  return rows
    .filter((r) => Number(r.score) >= MIN_SCORE)
    .map((r) => ({
      source: "post",
      postId: r.post_id,
      title: r.title ?? "(Không có tiêu đề)",
      content: String(r.content || ""),
      fragment: String(r.fragment || ""),
      score: Number(r.score || 0),
    }))
    .sort((a, b) => b.score - a.score);
}

/** 1) Full-text Post chính */
export async function searchChunksFT(query, limit, topicIds = []) {
  const rows = await prisma.$queryRawUnsafe(
    `
    SELECT ${selectCols()}
    FROM post_chunks pc JOIN posts p ON p.id = pc.post_id
    WHERE pc.tsv @@ websearch_to_tsquery('simple', unaccent($1))
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
        p.title
      FROM post_chunks pc JOIN posts p ON p.id = pc.post_id
      WHERE EXISTS (SELECT 1 FROM unnest($1::text[]) tok WHERE unaccent(pc.content) ILIKE tok)
         OR EXISTS (SELECT 1 FROM unnest($1::text[]) tok WHERE unaccent(p.title)   ILIKE tok)
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

// ===== Course helpers =====
export async function findCourseIdsByNames(names = []) {
  if (!names?.length) return [];
  const pats = names.map((n) => `%${n}%`);
  const rows = await prisma.$queryRawUnsafe(
    `SELECT id FROM courses WHERE unaccent(title) ILIKE ANY($1) LIMIT 20;`,
    pats
  );
  return (rows || []).map((r) => r.id);
}

function courseSelectCols() {
  return `
    cc.id, cc.course_id, cc.module_id, cc.lesson_id, cc.content,
    (
      ts_rank(cc.tsv, websearch_to_tsquery('simple', unaccent($1)))
      + CASE WHEN unaccent(c.title)    ILIKE '%'||unaccent($1)||'%' THEN 0.08 ELSE 0 END
      + CASE WHEN unaccent(cc.content) ILIKE '%'||unaccent($1)||'%' THEN 0.12 ELSE 0 END
    ) AS score,
    ts_headline(
      'simple',
      cc.content,
      websearch_to_tsquery('simple', unaccent($1)),
      'StartSel="", StopSel="", MaxFragments=2, MinWords=6, MaxWords=18'
    ) AS fragment,
    c.title AS course_name,
    m.title AS module_title,
    l.title AS lesson_title
  `;
}

function normalizeCourse(rows = []) {
  return (rows || [])
    .map((r) => ({
      source: "course",
      courseId: r.course_id,
      title: r.lesson_title || r.module_title || r.course_name || "(Course)",
      content: String(r.content || ""),
      fragment: String(r.fragment || ""),
      score: Number(r.score || 0),
    }))
    .filter((r) => r.score >= 0.05)
    .sort((a, b) => b.score - a.score);
}

function courseFilterSQL(courseIds) {
  return courseIds?.length ? `AND cc.course_id = ANY($3)` : ``;
}

export async function searchCourseChunksFT(query, limit, courseIds = []) {
  const rows = await prisma.$queryRawUnsafe(
    `
    SELECT ${courseSelectCols()}
    FROM course_chunks cc
    JOIN courses c ON c.id = cc.course_id
    LEFT JOIN modules m ON m.id = cc.module_id
    LEFT JOIN lessons l ON l.id = cc.lesson_id
    WHERE cc.tsv @@ websearch_to_tsquery('simple', unaccent($1))
    ${courseFilterSQL(courseIds)}
    ORDER BY score DESC, cc.id DESC
    LIMIT $2;
    `,
    ...(courseIds.length ? [query, limit, courseIds] : [query, limit])
  );
  return normalizeCourse(rows);
}

export async function searchCourseChunksFT_OR(
  tokens = [],
  limit,
  courseIds = []
) {
  const orQ = tokens.join(" OR ");
  const rows = await prisma.$queryRawUnsafe(
    `
    SELECT ${courseSelectCols()}
    FROM course_chunks cc
    JOIN courses c ON c.id = cc.course_id
    LEFT JOIN modules m ON m.id = cc.module_id
    LEFT JOIN lessons l ON l.id = cc.lesson_id
    WHERE cc.tsv @@ websearch_to_tsquery('simple', unaccent($1))
    ${courseFilterSQL(courseIds)}
    ORDER BY score DESC, cc.id DESC
    LIMIT $2;
    `,
    ...(courseIds.length ? [orQ, limit, courseIds] : [orQ, limit])
  );
  return normalizeCourse(rows);
}

export async function searchCourseChunksILIKE(
  patterns = [],
  limit,
  courseIds = []
) {
  const rows = await prisma.$queryRawUnsafe(
    `
    WITH hit AS (
      SELECT
        cc.id, cc.course_id, cc.module_id, cc.lesson_id, cc.content,
        (
          (SELECT COUNT(*) FROM unnest($1::text[]) tok WHERE unaccent(cc.content) ILIKE tok)*0.02
        + (SELECT COUNT(*) FROM unnest($1::text[]) tok WHERE unaccent(c.title)   ILIKE tok)*0.03
        ) AS score,
        NULL::text AS fragment,
        c.title AS course_name, m.title AS module_title, l.title AS lesson_title
      FROM course_chunks cc
      JOIN courses c ON c.id = cc.course_id
      LEFT JOIN modules m ON m.id = cc.module_id
      LEFT JOIN lessons l ON l.id = cc.lesson_id
      WHERE EXISTS (SELECT 1 FROM unnest($1::text[]) tok WHERE unaccent(cc.content) ILIKE tok)
         OR EXISTS (SELECT 1 FROM unnest($1::text[]) tok WHERE unaccent(c.title)   ILIKE tok)
      ${courseFilterSQL(courseIds)}
    ),
    agg AS (SELECT course_id FROM hit GROUP BY course_id HAVING COUNT(*) >= 2)
    SELECT h.* FROM hit h JOIN agg a ON a.course_id = h.course_id
    ORDER BY h.score DESC, h.id DESC
    LIMIT $2;
    `,
    ...(courseIds.length ? [patterns, limit, courseIds] : [patterns, limit])
  );
  return normalizeCourse(rows);
}

// ===== Test helpers =====
function testSelectCols() {
  return `
    tc.id,
    tc.test_id,
    tc.content,
    (
      ts_rank(tc.tsv, websearch_to_tsquery('simple', unaccent($1)))
      + CASE WHEN unaccent(t.title)    ILIKE '%'||unaccent($1)||'%' THEN 0.08 ELSE 0 END
      + CASE WHEN unaccent(tc.content) ILIKE '%'||unaccent($1)||'%' THEN 0.12 ELSE 0 END
    ) AS score,
    ts_headline(
      'simple',
      tc.content,
      websearch_to_tsquery('simple', unaccent($1)),
      'StartSel="", StopSel="", MaxFragments=2, MinWords=6, MaxWords=18'
    ) AS fragment,
    t.title AS test_title
  `;
}

function normalizeTest(rows = []) {
  return (rows || [])
    .map((r) => ({
      source: "test",
      testId: r.test_id,
      title: r.test_title || "(Test)",
      content: String(r.content || ""),
      fragment: String(r.fragment || ""),
      score: Number(r.score || 0),
    }))
    .filter((r) => r.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score);
}

export async function searchTestChunksFT(query, limit) {
  const rows = await prisma.$queryRawUnsafe(
    `
    SELECT ${testSelectCols()}
    FROM test_chunks tc
    JOIN tests t ON t.id = tc.test_id
    WHERE tc.tsv @@ websearch_to_tsquery('simple', unaccent($1))
    ORDER BY score DESC, tc.id DESC
    LIMIT $2;
    `,
    query,
    limit
  );

  return normalizeTest(rows);
}

export async function searchTestChunksFT_OR(tokens = [], limit) {
  const orQ = tokens.join(" OR ");
  const rows = await prisma.$queryRawUnsafe(
    `
    SELECT ${testSelectCols()}
    FROM test_chunks tc
    JOIN tests t ON t.id = tc.test_id
    WHERE tc.tsv @@ websearch_to_tsquery('simple', unaccent($1))
    ORDER BY score DESC, tc.id DESC
    LIMIT $2;
    `,
    orQ,
    limit
  );

  return normalizeTest(rows);
}

export async function searchTestChunksILIKE(patterns = [], limit) {
  const rows = await prisma.$queryRawUnsafe(
    `
    WITH hit AS (
      SELECT
        tc.id,
        tc.test_id,
        tc.content,
        (
          (SELECT COUNT(*) FROM unnest($1::text[]) tok WHERE unaccent(tc.content) ILIKE tok)*0.02
        + (SELECT COUNT(*) FROM unnest($1::text[]) tok WHERE unaccent(t.title)   ILIKE tok)*0.03
        ) AS score,
        NULL::text AS fragment,
        t.title AS test_title
      FROM test_chunks tc
      JOIN tests t ON t.id = tc.test_id
      WHERE EXISTS (SELECT 1 FROM unnest($1::text[]) tok WHERE unaccent(tc.content) ILIKE tok)
         OR EXISTS (SELECT 1 FROM unnest($1::text[]) tok WHERE unaccent(t.title)   ILIKE tok)
    ),
    agg AS (SELECT test_id FROM hit GROUP BY test_id HAVING COUNT(*) >= 2)
    SELECT h.* FROM hit h JOIN agg a ON a.test_id = h.test_id
    ORDER BY h.score DESC, h.id DESC
    LIMIT $2;
    `,
    patterns,
    limit
  );

  return normalizeTest(rows);
}
