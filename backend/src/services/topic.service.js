import prisma from "../prisma.js";
import { NotFoundError } from "../utils/AppError.js";
import * as topicRepo from "../repositories/topic.repository.js";

/** util: tạo slug đơn giản */
function toSlug(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// GET /topics
export async function listTopics() {
  return topicRepo.listTopicsWithCount();
}

// GET /topics/:slug
export async function getTopicBySlug(slug) {
  const topic = await topicRepo.findTopicBySlug(slug);
  if (!topic) throw new NotFoundError("Topic not found");
  return topic;
}

// GET /topics/:slug/posts
export async function listPostsByTopicSlug({ slug, offset = 0, limit = 50 }) {
  return prisma.$transaction((tx) =>
    topicRepo.listPostsByTopicSlug({ slug, offset, limit }, tx)
  );
}

// POST /topics
export async function createTopic({ name, slug, description }) {
  const finalSlug = (slug?.trim() ? toSlug(slug) : toSlug(name)).slice(0, 255);

  return prisma.$transaction(async (tx) => {
    const existed = await topicRepo.findTopicBySlug(finalSlug, tx);
    if (existed) {
      const err = new Error("Unique constraint failed on the fields: (slug)");
      err.code = "P2002";
      err.meta = { target: ["slug"] };
      throw err;
    }
    return topicRepo.createTopic(
      { name: name.trim(), slug: finalSlug, description },
      tx
    );
  });
}

// DELETE /topics/:id
export async function deleteTopic(id) {
  await prisma.$transaction(async (tx) => {
    const exists = await tx.topic.findUnique({
      where: { id: Number(id) },
      select: { id: true },
    });
    if (!exists) throw new NotFoundError("Topic not found");
    await topicRepo.deleteTopicById(Number(id), tx);
  });
}
