import prisma from "../prisma.js";
import { NotFoundError } from "../utils/AppError.js";
import * as topicRepo from "../repositories/topic.repository.js";
import * as postRepo from "../repositories/post.repository.js";

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
  return postRepo.listPostsByTopicSlug({ slug, offset, limit });
}

// POST /topics
export async function createTopic({ name, slug, description }) {
  const finalSlug = (slug?.trim() ? toSlug(slug) : toSlug(name)).slice(0, 255);
  // Kiểm tra trùng slug trước
  const existed = await topicRepo.findTopicBySlug(finalSlug);
  if (existed) {
    // Nếu topic đã tồn tại thì trả về luôn
    return existed;
  }
  // Nếu chưa có thì tạo mới
  return topicRepo.createTopic({
    name: name.trim(),
    slug: finalSlug,
    description,
  });
}

// DELETE /topics/:id
export async function deleteTopic(id) {
  const topicId = Number(id);
  const existed = await prisma.topic.findUnique({
    where: { id: topicId },
    select: { id: true },
  });
  if (!existed) throw new NotFoundError("Topic not found");
  await topicRepo.deleteTopicById(topicId);
}
