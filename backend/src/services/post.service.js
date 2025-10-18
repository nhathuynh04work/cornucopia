import {
  createPost,
  getAllPosts,
  getPostById,
  deletePostById,
  updatePostById,
} from "../repositories/post.repository.js";
import prisma from "../prisma.js";

export async function createDefaultPostService({
  authorId,
  topicId = null,
  coverUrl = null,
}) {
  return prisma.$transaction(async (client) => {
    let resolvedTopicId = null;
    if (topicId !== null && Number(topicId) > 0) {
      resolvedTopicId = Number(topicId);
    } else {
      const def = await client.topic.upsert({
        where: { slug: "chung" },
        update: {},
        create: {
          name: "Chung",
          slug: "chung",
          description: "Chủ đề mặc định",
        },
        select: { id: true },
      });
      resolvedTopicId = def.id;
    }

    const slug = `default-${Date.now()}`;
    const post = await createPost(client, {
      slug,
      title: "Bài viết mặc định",
      content: "<p>Nội dung mặc định</p>",
      authorId,
      topicId: resolvedTopicId,
      coverUrl,
    });

    return post;
  });
}

export async function getPostService({ id }) {
  return prisma.$transaction(async (client) => {
    const post = await getPostById(client, { id });
    return post;
  });
}

export async function getPostsService() {
  return prisma.$transaction(async (client) => {
    const posts = await getAllPosts(client);
    return posts;
  });
}

export async function deletePostService({ id }) {
  return prisma.$transaction(async (client) => {
    const deleted = await deletePostById(client, { id });
    return deleted;
  });
}

export async function updatePostService(payload) {
  return prisma.$transaction(async (client) => {
    const updated = await updatePostById(client, payload);
    return updated;
  });
}
