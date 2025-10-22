import prisma from "../prisma.js";

export async function listTopicsWithCount(client = prisma) {
  const topics = await client.topic.findMany({
    include: {
      posts: {
        where: { post: { status: "published" } },
      },
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

export async function findTopicBySlug(slug, client = prisma) {
  return client.topic.findUnique({
    where: { slug },
  });
}

export async function createTopic(data, client = prisma) {
  return client.topic.create({
    data,
  });
}

export async function deleteTopicById(id, client = prisma) {
  await client.topic.delete({ where: { id } });
}
