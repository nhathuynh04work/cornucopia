import {
  paginatePosts,
  getPostBySlug,
} from "../repositories/post.repository.js";
import { findTopicBySlug } from "../repositories/topic.repository.js";

export async function listPostsController(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const q = (req.query.q || "").trim() || undefined;
    const topicSlug = (req.query.topic || "").trim() || undefined;

    let topicId;
    if (topicSlug) {
      const t = await findTopicBySlug(topicSlug);
      if (!t) return res.json({ items: [], total: 0, page: 1, pageSize });
      topicId = t.id;
    }
    const data = await paginatePosts({ page, pageSize, topicId, q });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getPostDetailController(req, res, next) {
  try {
    const post = await getPostBySlug(req.params.slug);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
}
