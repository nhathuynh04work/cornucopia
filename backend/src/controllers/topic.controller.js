import * as topicService from "../services/topic.service.js";

// GET /topics
export async function listTopics(_req, res) {
  const topics = await topicService.listTopics();
  return res.status(200).json({ topics });
}

// GET /topics/:slug
export async function getTopicBySlug(req, res) {
  const topic = await topicService.getTopicBySlug({
    slug: String(req.params.slug),
  });
  if (!topic) return res.status(404).json({ error: "Topic not found" });
  return res.status(200).json({ topic });
}

// GET /topics/:slug/posts
export async function listPostsByTopicSlug(req, res) {
  const { page = 1, pageSize = 30 } = req.query; // đã coerce nếu dùng validateQueries
  const posts = await topicService.listPostsByTopicSlug({
    slug: String(req.params.slug),
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });
  return res.status(200).json({ posts });
}

// POST /topics
export async function createTopic(req, res) {
  const topic = await topicService.createTopic(req.body);
  return res.status(201).json({ topic });
}

// DELETE /topics/:id
export async function deleteTopicById(req, res) {
  const deleted = await topicService.deleteTopic(req.params.id);
  return res.status(200).json({ message: "Topic deleted", topic: deleted });
}
