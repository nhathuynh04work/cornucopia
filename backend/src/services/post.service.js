import { withTransaction } from "../db/transaction.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePostById,
  updatePostById,
} from "../repositories/post.repository.js";

export async function createDefaultPostService({
  authorId,
  topicId = null,
  coverUrl = null,
}) {
  return withTransaction(async (client) => {
    const slug = `default-${Date.now()}`;
    const post = await createPost(client, {
      slug,
      title: "Bài viết mặc định",
      content: "<p>Nội dung mặc định</p>",
      authorId,
      topicId, //New
      coverUrl, //New
    });
    return post;
  });
}

export async function getPostService({ id }) {
  return withTransaction(async (client) => {
    const post = await getPostById(client, { id });
    return post;
  });
}

export async function getPostsService() {
  return withTransaction(async (client) => {
    const posts = await getAllPosts(client);
    return posts;
  });
}

export async function deletePostService({ id }) {
  return withTransaction(async (client) => {
    const deleted = await deletePostById(client, { id });
    return deleted;
  });
}

export async function updatePostService(payload) {
  return withTransaction(async (client) => {
    const updated = await updatePostById(client, payload);
    return updated;
  });
}
