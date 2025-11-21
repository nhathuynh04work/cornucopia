import prisma from "../prisma.js";

/*
 * Chuẩn hoá topics: PostTopic[] -> Topic[]
 */
function normalizePostTopics(p) {
  if (!p) return p;
  const topics =
    Array.isArray(p.topics) && p.topics.length && p.topics[0]?.topic
      ? p.topics.map((pt) => pt.topic)
      : Array.isArray(p.topics)
      ? p.topics
      : [];
  return { ...p, topics };
}

/* Tạo mới một bài viết (Post) */
export async function createPost(data, client = prisma) {
  return client.post.create({ data });
}

/* Lấy thông tin một bài viết theo ID (include author + topics) */
export async function findById(id, client = prisma) {
  const row = await client.post.findUnique({
    where: { id: Number(id) },
    include: {
      author: true,
      topics: {
        include: { topic: true },
      },
    },
  });

  return normalizePostTopics(row);
}

/* Lấy tất cả bài viết PUBLIC (status = 'published') */
export async function getAllPosts(client = prisma) {
  const rows = await client.post.findMany({
    where: { status: "published" },
    include: {
      author: true,
      topics: {
        include: { topic: { select: { id: true, name: true, slug: true } } },
      },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(normalizePostTopics);
}

/* Lấy tất cả bài viết của 1 author */
export async function getPostsByAuthor(authorId, client = prisma) {
  const rows = await client.post.findMany({
    where: { authorId: Number(authorId) },
    include: {
      author: true,
      topics: {
        include: { topic: { select: { id: true, name: true, slug: true } } },
      },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(normalizePostTopics);
}

/* Xóa bài viết theo ID */
export async function deletePostById(id, client = prisma) {
  await client.post.delete({ where: { id: Number(id) } });
}

export async function updatePostBase(id, data, client = prisma) {
  return client.post.update({
    where: { id: Number(id) },
    data,
  });
}

// Thay toàn bộ topics của post = topicIds (đã chuẩn hoá)
export async function replacePostTopics(id, topicIds, client = prisma) {
  return client.post.update({
    where: { id: Number(id) },
    data: {
      topics: {
        deleteMany: {}, // xoá toàn bộ liên kết cũ
        create: topicIds.map((tid) => ({
          topic: { connect: { id: Number(tid) } },
        })),
      },
    },
    include: {
      author: { select: { id: true, name: true, email: true } },
      topics: {
        include: { topic: { select: { id: true, name: true, slug: true } } },
      },
    },
  });
}

/* Lấy danh sách bài viết theo slug của topic */
export async function listPostsByTopicSlug(
  { slug, offset = 0, limit = 50 },
  client = prisma
) {
  const rows = await client.post.findMany({
    where: {
      status: "published",
      topics: { some: { topic: { slug } } },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    skip: offset,
    take: limit,
    include: {
      author: true,
      topics: { include: { topic: true } },
    },
  });

  // 🔁 Normalize: PostTopic[] -> Topic[]
  return rows.map((p) => ({
    ...p,
    topics: Array.isArray(p.topics) ? p.topics.map((pt) => pt.topic) : [],
  }));
}
