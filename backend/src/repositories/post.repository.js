/* Tạo mới một bài viết (Post)
 * Trả về bài viết kèm thông tin tác giả (author) và chủ đề (topic)*/

export async function createPost(
  client,
  { slug, title, content, authorId, topicId = null, coverUrl = null }
) {
  return client.post.create({
    data: {
      authorId,
      title,
      slug,
      content,
      status: "draft",
      publishedAt: null,
      topicId,
      coverUrl,
    },
    include: {
      author: { select: { id: true, name: true, email: true } },
      topic: { select: { id: true, name: true, slug: true } },
    },
  });
}

/* Lấy thông tin một bài viết theo ID
 * - Include quan hệ author và topic (tương đương LEFT JOIN trong SQL cũ)*/
export async function getPostById(client, { id }) {
  return client.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, email: true } },
      topic: { select: { id: true, name: true, slug: true } },
    },
  });
}

/* Lấy tất cả các bài viết
 * - Sắp xếp theo thứ tự giảm dần của ngày public (publishedAt) và ngày tạo (createdAt)*/
export async function getAllPosts(client) {
  return client.post.findMany({
    include: {
      author: { select: { id: true, name: true, email: true } },
      topic: { select: { id: true, name: true, slug: true } },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
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

/* Cập nhật nội dung bài viết
 *   + Nếu status = 'published' và chưa có publishedAt → đặt là thời gian hiện tại
 *   + Nếu status khác 'published' → đặt null
 *   + Nếu đang 'published' và đã có publishedAt → giữ nguyên */
export async function updatePostById(
  client,
  { id, title, content, status, coverUrl = null, topicId = null }
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

  return client.post.update({
    where: { id },
    data: {
      title,
      content,
      status,
      coverUrl,
      topicId,
      publishedAt: nextPublishedAt,
    },
    include: {
      author: { select: { id: true, name: true, email: true } },
      topic: { select: { id: true, name: true, slug: true } },
    },
  });
}

/* Lấy danh sách bài viết theo slug của topic
 * - Dùng quan hệ lồng: where: { topic: { is: { slug } } }
 * - Có phân trang: offset → skip, limit → take
 * - Trả về danh sách bài viết cùng thông tin tác giả & chủ đề */
export async function getPostsByTopicSlug(
  client,
  { slug, offset = 0, limit = 50 }
) {
  return client.post.findMany({
    where: { topic: { is: { slug } } },
    include: {
      author: { select: { id: true, name: true, email: true } },
      topic: { select: { id: true, name: true, slug: true } },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    skip: offset,
    take: limit,
  });
}
