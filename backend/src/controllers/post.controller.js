import {
  createDefaultPostService,
  getPostService,
  getPostsService,
  deletePostService,
  updatePostService,
} from "../services/post.service.js";

//POST /posts
export async function createDefaultPostController(req, res) {
  const { userId, topicId = null, coverUrl = null } = req.body || {};

  // validate
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }
  if (Number.isNaN(Number(userId))) {
    return res.status(400).json({ error: "userId must be a number" });
  }
  if (topicId !== null && Number.isNaN(Number(topicId))) {
    return res.status(400).json({ error: "topicId must be a number" });
  }

  try {
    const post = await createDefaultPostService({
      authorId: Number(userId),
      topicId: topicId !== null ? Number(topicId) : null,
      coverUrl: coverUrl ?? null,
    });
    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: "Internal Server Error" });
  }
}

//GET /posts/:id
export async function getPostController(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "id must be a number" });
  }

  try {
    const post = await getPostService({ id });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.status(200).json({ post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: "Internal Server Error" });
  }
}

//GET /posts
export async function getPostsController(req, res) {
  try {
    const posts = await getPostsService();
    return res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: "Internal Server Error" });
  }
}

//DELETE /posts/:id
export async function deletePostController(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "id must be a number" });
  }
  try {
    const deleted = await deletePostService({ id });
    if (!deleted) return res.status(404).json({ error: "Post not found" });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: "Internal Server Error" });
  }
}

//PUT /posts/:id
export async function updatePostController(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id))
    return res.status(400).json({ error: "id must be a number" });

  let {
    title,
    content,
    status,
    coverUrl = null,
    topicId = null,
  } = req.body || {};
  status = (status || "draft").toLowerCase();

  if (!title || !content)
    return res.status(400).json({ error: "title and content are required" });
  if (!["draft", "published", "archived"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const post = await updatePostService({
      id,
      title,
      content,
      status,
      coverUrl,
      topicId: topicId !== null ? Number(topicId) : null,
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.json({ post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: "Internal Server Error" });
  }
}
