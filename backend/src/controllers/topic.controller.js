import {
  listTopicsService,
  getTopicBySlugService,
  listPostsByTopicSlugService,
} from "../services/topic.service.js";

// GET /topics
export async function listTopicsController(req, res, next) {
  try {
    const topics = await listTopicsService();
    // FE của bạn handle được cả array lẫn { topics }, dùng { topics } cho đồng bộ:
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
