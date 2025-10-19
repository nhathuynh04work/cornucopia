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
  topicIds = [],
  coverUrl = null,
}) {
  return prisma.$transaction(async (client) => {
    let resolvedTopicIds = Array.isArray(topicIds)
      ? topicIds.map((x) => Number(x)).filter((x) => Number.isFinite(x))
      : [];

    // Nếu không truyền topicIds -> gán topic mặc định "Chung"
    if (!resolvedTopicIds.length) {
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
      resolvedTopicIds = [def.id];
    }

    const slug = `default-${Date.now()}`;
    const post = await createPost(client, {
      slug,
      title: "Bài viết mặc định",
      content: "<p>Nội dung mặc định</p>",
      authorId,
      topicIds: resolvedTopicIds,
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
  // payload: { id, title, content, status, coverUrl, topicIds? }
  return prisma.$transaction(async (client) => {
    let topicIds = payload.topicIds;

    if (Array.isArray(topicIds)) {
      // chuẩn hoá mảng id -> number hợp lệ
      topicIds = topicIds
        .map((x) => Number(x))
        .filter((x) => Number.isFinite(x));

      // nếu gửi [] -> gắn topic mặc định "Chung"
      if (topicIds.length === 0) {
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
        topicIds = [def.id];
      }
    }

    const updated = await updatePostById(client, {
      ...payload,
      topicIds,
    });

    return updated;
  });
}
