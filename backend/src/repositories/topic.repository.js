import prisma from "../prisma.js";

/* Lấy danh sách tất cả chủ đề (topics) kèm số lượng bài viết đã được publish */
export async function listTopicsWithCount(client = prisma) {
  // Lấy danh sách tất cả topic
  const topics = await client.topic.findMany({
    include: {
      posts: {
        where: { status: "published" },
        select: { id: true }, // chỉ cần id để đếm
      },
    },
    orderBy: { name: "asc" },
  });

  // Bổ sung trường postCount cho từng topic
  return topics.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    postCount: t.posts.length,
  }));
}

/* Tìm một topic theo slug */
export async function findTopicBySlug(client, slug) {
  const topic = await client.topic.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
  });
  return topic || null;
}
