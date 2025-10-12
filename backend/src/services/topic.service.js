import {
  listTopicsWithCount,
  findTopicBySlug,
  createTopic,
  deleteTopicById,
} from "../repositories/topic.repository.js";
import prisma from "../prisma.js";
import { getPostsByTopicSlug } from "../repositories/post.repository.js";

/** util: tạo slug đơn giản */
function toSlug(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** Lấy danh sách topics kèm post_count */
export async function listTopicsService() {
  return listTopicsWithCount();
}

/** Lấy 1 topic theo slug */
export async function getTopicBySlugService({ slug }) {
  return findTopicBySlug(undefined, slug);
}

/* Lấy danh sách bài theo topic slug (phân trang) */
export async function listPostsByTopicSlugService({
  slug,
  offset = 0,
  limit = 50,
}) {
  return prisma.$transaction(async (client) => {
    return getPostsByTopicSlug(client, { slug, offset, limit });
  });
}

/* Tạo mới một topic */
export async function createTopicService({ name, slug, description }) {
  const finalSlug = (slug?.trim() ? toSlug(slug) : toSlug(name)).slice(0, 255);

  return prisma.$transaction(async (tx) => {
    const existed = await findTopicBySlug(tx, finalSlug);
    if (existed) {
      const err = new Error("Unique constraint failed on the fields: (slug)");
      err.code = "P2002";
      err.meta = { target: ["slug"] };
      throw err;
    }
    return createTopic(tx, { name: name.trim(), slug: finalSlug, description });
  });
}

/** Xóa topic theo id */
export async function deleteTopicByIdService({ id }) {
  return prisma.$transaction(async (tx) => {
    return deleteTopicById(tx, Number(id));
  });
}
