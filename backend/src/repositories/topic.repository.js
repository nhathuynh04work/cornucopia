import prisma from "../prisma.js";

/* Lấy danh sách tất cả chủ đề (topics) kèm số lượng bài viết đã được publish */
export async function listTopicsWithCount(client = prisma) {
  const topics = await client.topic.findMany({
    include: {
      posts: { where: { status: "published" }, select: { id: true } },
    },
    orderBy: { name: "asc" },
  });

  return topics.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    postCount: t.posts.length,
  }));
}

/* Tìm một topic theo slug */
export async function findTopicBySlug(client = prisma, slug) {
  const topic = await client.topic.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, description: true },
  });
  return topic || null;
}

/* Tạo topic */
export async function createTopic(
  client = prisma,
  { name, slug, description }
) {
  return client.topic.create({
    data: { name, slug, description },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      createdAt: true,
    },
  });
}

/* Xóa topic theo id */
export async function deleteTopicById(client = prisma, id) {
  return client.topic.delete({
    where: { id },
    select: { id: true, name: true, slug: true },
  });
}
