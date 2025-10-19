/* Repository cho Post theo quan hệ M↔N (Post ⟷ Topic qua PostTopic) */

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
export async function createPost(
  client,
  { slug, title, content, authorId, topicIds = [], coverUrl = null }
) {
  const created = await client.post.create({
    data: {
      authorId,
      title,
      slug,
      content,
      status: "draft",
      publishedAt: null,
      coverUrl,
      ...(Array.isArray(topicIds) && topicIds.length
        ? {
            topics: {
              create: topicIds.map((tid) => ({
                topic: { connect: { id: Number(tid) } },
              })),
            },
          }
        : {}),
    },
    include: {
      author: { select: { id: true, name: true, email: true } },
      topics: {
        include: { topic: { select: { id: true, name: true, slug: true } } },
      },
    },
  });
  return normalizePostTopics(created);
}

/* Lấy thông tin một bài viết theo ID (include author + topics) */
export async function getPostById(client, { id }) {
  const row = await client.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, email: true } },
      topics: {
        include: { topic: { select: { id: true, name: true, slug: true } } },
      },
    },
  });
  return normalizePostTopics(row);
}

/* Lấy tất cả các bài viết (order by publishedAt desc, createdAt desc) */
export async function getAllPosts(client) {
  const rows = await client.post.findMany({
    include: {
      author: { select: { id: true, name: true, email: true } },
      topics: {
        include: { topic: { select: { id: true, name: true, slug: true } } },
      },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(normalizePostTopics);
}

/* Xóa bài viết theo ID */
export async function deletePostById(client, { id }) {
  try {
    const deleted = await client.post.delete({
      where: { id },
      select: { id: true },
    });
    return deleted.id;
  } catch {
    return null;
  }
}

/* Cập nhật nội dung bài viết */
export async function updatePostById(
  client,
  { id, title, content, status, coverUrl = null, topicIds }
) {
  const existing = await client.post.findUnique({
    where: { id },
    select: { publishedAt: true },
  });
  if (!existing) return null;

  let nextPublishedAt = existing.publishedAt;
  if (status === "published") {
    if (!existing.publishedAt) nextPublishedAt = new Date();
  } else {
    nextPublishedAt = null;
  }

  const data = {
    title,
    content,
    status,
    coverUrl,
    publishedAt: nextPublishedAt,
  };

  if (Array.isArray(topicIds)) {
    data.topics = {
      deleteMany: {}, // xoá toàn bộ liên kết cũ
      create: topicIds.map((tid) => ({
        topic: { connect: { id: Number(tid) } },
      })),
    };
  }

  const updated = await client.post.update({
    where: { id },
    data,
    include: {
      author: { select: { id: true, name: true, email: true } },
      topics: {
        include: { topic: { select: { id: true, name: true, slug: true } } },
      },
    },
  });
  return normalizePostTopics(updated);
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
