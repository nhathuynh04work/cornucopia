import {
  listTopicsService,
  getTopicBySlugService,
  listPostsByTopicSlugService,
  createTopicService,
  deleteTopicByIdService,
} from "../services/topic.service.js";

// GET /topics
export async function listTopicsController(req, res, next) {
  try {
    const topics = await listTopicsService();
    return res.json({ topics });
  } catch (err) {
    next(err);
  }
}

// GET /topics/:slug
export async function getTopicBySlugController(req, res, next) {
  try {
    const topic = await getTopicBySlugService({
      slug: String(req.params.slug),
    });
    if (!topic) return res.status(404).json({ error: "Topic not found" });
    return res.json({ topic });
  } catch (err) {
    next(err);
  }
}

// GET /topics/:slug/posts
export async function listPostsByTopicSlugController(req, res, next) {
  try {
    const { slug } = req.params;
    const { page = "1", pageSize = "30" } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const sizeNum = Math.max(1, Math.min(parseInt(pageSize), 100));

    const posts = await listPostsByTopicSlugService({
      slug: String(slug),
      offset: (pageNum - 1) * sizeNum,
      limit: sizeNum,
    });

    return res.json({ posts });
  } catch (err) {
    next(err);
  }
}

// POST /topics
export async function createTopicController(req, res, next) {
  try {
    const { name, slug, description } = req.body ?? {};
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Field 'name' is required" });
    }

    const topic = await createTopicService({
      name: String(name),
      slug: slug?.toString(),
      description: description?.toString(),
    });
    return res.status(201).json({ topic });
  } catch (err) {
    if (err?.code === "P2002") {
      return res.status(409).json({ error: "Topic name/slug already exists" });
    }
    next(err);
  }
}

// DELETE /topics/:id
export async function deleteTopicByIdController(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid topic id" });
    }

    const deleted = await deleteTopicByIdService({ id });
    // deleted chứa { id, name, slug }
    return res.json({ message: "Topic deleted", topic: deleted });
  } catch (err) {
    if (err?.code === "P2025") {
      return res.status(404).json({ error: "Topic not found" });
    }
    next(err);
  }
}
