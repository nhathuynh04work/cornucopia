/* 
Hàm này dùng để chuẩn hoá dữ liệu `topics` của một bài viết (Post) để frontend luôn nhận được dạng thống nhất: mảng Topic[] thuần tuý.
Vì trong Prisma schema, mối quan hệ giữa Post và Topic là nhiều–nhiều (M:N) thông qua bảng trung gian PostTopic

⚙️ Dữ liệu TRƯỚC khi chuẩn hoá (khi Prisma truy vấn với `include: { topics: { include: { topic: true } } }`)
 *
 *  {
 *    id: 1,
 *    title: "Giới thiệu về AI",
 *    topics: [
 *      { topic: { id: 2, name: "AI", slug: "ai" } },
 *      { topic: { id: 5, name: "Machine Learning", slug: "machine-learning" } }
 *    ]
 *  }
 *
 * 👉 Ở đây: `topics` là mảng các bản ghi **trung gian PostTopic**,
 *     mỗi phần tử có thuộc tính `topic` (chứa dữ liệu thật của Topic).
 *
 * ---
 * ✅ Dữ liệu SAU khi chuẩn hoá (kết quả sau khi gọi normalizePostTopics)
 *
 *  {
 *    id: 1,
 *    title: "Giới thiệu về AI",
 *    topics: [
 *      { id: 2, name: "AI", slug: "ai" },
 *      { id: 5, name: "Machine Learning", slug: "machine-learning" }
 *    ]
 *  }
 *
 * 👉 Sau khi chuẩn hoá: `topics` trở thành mảng các đối tượng Topic thuần túy,
 *     không còn wrapper `topic:` bên trong.
 * Trước chuẩn hoá: topics = [{ topic: Topic }, { topic: Topic }]
 * Sau chuẩn hoá: topics = [Topic, Topic]
 * 🧠 Lợi ích:
 * - Giúp frontend chỉ cần xử lý `post.topics` như mảng `Topic[]`.
 * - Tránh lỗi khi phải check `t.topic` hay `t.id`.
 * - Dữ liệu đồng nhất dù truy vấn Prisma khác nhau (`include topic` hoặc `select topic`).
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
    topics: Array.isArray(p.topics)
      ? p.topics.map((pt) => pt.topic) // chỉ còn Topic[]
      : [],
  }));
}
