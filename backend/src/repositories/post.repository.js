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

/* Tạo mới một bài viết (Post)
 * Trả về bài viết kèm thông tin tác giả (author) và danh sách chủ đề (topics: Topic[]) */
export async function createPost(data, client = prisma) {
  return client.post.create({ data });
}

/* Lấy thông tin một bài viết theo ID (include author + topics) */
export async function findById(id, client = prisma) {
  const row = await client.post.findUnique({
    where: { id },
    include: {
      author: true,
      topics: {
        include: { topic: true },
      },
    },
  });

  return normalizePostTopics(row);
}

/* Lấy tất cả các bài viết (order by publishedAt desc, createdAt desc) */
export async function getAllPosts(client = prisma) {
  const rows = await client.post.findMany({
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
  await client.post.delete({ where: { id } });
}

export async function updatePostBase(id, data, client = prisma) {
  return client.post.update({
    where: { id },
    data,
  });
}

// Thay toàn bộ topics của post = topicIds (đã chuẩn hoá)
export async function replacePostTopics(id, topicIds, client = prisma) {
  return client.post.update({
    where: { id },
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

/*Lấy danh sách bài viết theo slug của topic*/
export async function getPostsByTopicSlug(
  client,
  { slug, offset = 0, limit = 50 }
) {
  const topic = await client.topic.findUnique({
    where: { slug: String(slug) },
    select: { id: true },
  });
  if (!topic) return [];

  const rows = await client.postTopic.findMany({
    where: {
      topicId: topic.id,
      post: { status: "published" }, // chỉ lấy bài đã publish
    },
    include: {
      post: {
        include: {
          author: { select: { id: true, name: true, email: true } },
          topics: {
            include: {
              topic: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      },
    },
    orderBy: { post: { publishedAt: "desc" } },
    skip: offset,
    take: limit,
  });

  return rows.map((r) => normalizePostTopics(r.post));
}
