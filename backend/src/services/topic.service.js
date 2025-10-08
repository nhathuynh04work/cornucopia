import {
  listTopicsWithCount,
  findTopicBySlug,
} from "../repositories/topic.repository.js";
import prisma from "../prisma.js";
import { getPostsByTopicSlug } from "../repositories/post.repository.js";

/** Lấy danh sách topics kèm post_count */
export async function listTopicsService() {
  return listTopicsWithCount();
}

/** Lấy 1 topic theo slug */
export async function getTopicBySlugService({ slug }) {
  return findTopicBySlug(slug);
}

/** Lấy danh sách bài theo topic slug (phân trang) */
export async function listPostsByTopicSlugService({
  slug,
  offset = 0,
  limit = 50,
}) {
  return prisma.$transaction(async (client) => {
    return getPostsByTopicSlug(client, { slug, offset, limit });
  });
}
