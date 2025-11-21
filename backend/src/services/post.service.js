// src/services/post.service.js
import prisma from "../prisma.js";
import { NotFoundError } from "../utils/AppError.js";
import { defaultPost } from "../utils/constants.js";
import * as postRepo from "../repositories/post.repository.js";
import * as ragService from "../chatbot/rag.service.js";

export async function createDefaultPost(authorId) {
  const slug = `default-post-${Date.now()}`;
  const post = await postRepo.createPost({ ...defaultPost, authorId, slug });

  // gán topic mặc định (id = 1)
  await postRepo.replacePostTopics(post.id, [1]);

  // ✅ tự index dữ liệu cho chatbot nếu có content
  if (post?.content) {
    await ragService.reindexPost(post.id, post.content);
  }

  return postRepo.findById(post.id);
}

export async function getPost(id) {
  const post = await postRepo.findById(id);
  if (!post) throw new NotFoundError("Post not found");
  return post;
}

/**
 * Lấy danh sách bài viết PUBLIC (dùng cho AllPosts)
 * - chỉ trả status = 'published'
 */
export async function getPosts() {
  return postRepo.getAllPosts();
}

/**
 * Lấy tất cả bài viết của user hiện tại (dùng cho /posts/my)
 * - frontend MyPosts/MyDrafts sẽ filter theo status
 */
export async function getMyPosts(authorId) {
  return postRepo.getPostsByAuthor(authorId);
}

export async function deletePost(id) {
  const post = await postRepo.findById(id);
  if (!post) throw new NotFoundError("Post not found");
  await postRepo.deletePostById(id);
}

export async function updatePost(id, payload) {
  const post = await postRepo.findById(id);
  if (!post) throw new NotFoundError("Post not found");

  await prisma.$transaction(async (client) => {
    const { topicIds, ...rest } = payload;
    await postRepo.updatePostBase(id, rest, client);

    if (Array.isArray(topicIds)) {
      const topicIdsToUse = topicIds.length ? [...topicIds] : [1];
      await postRepo.replacePostTopics(id, topicIdsToUse, client);
    }

    // ✅ tự index lại sau khi cập nhật nội dung
    const updated = await postRepo.findById(id, client);
    if (updated?.content) {
      await ragService.reindexPost(updated.id, updated.content, client);
    }
  });

  return postRepo.findById(id);
}
