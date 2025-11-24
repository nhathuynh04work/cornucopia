import * as postService from "../services/post.service.js";

// POST /posts
export async function createDefaultPost(req, res) {
	const authorId = req.user.id;
	const post = await postService.createDefaultPost(authorId);
	res.status(201).json({ post });
}

// GET /posts/:id
export async function getPost(req, res) {
	const post = await postService.getPost(req.params.id);
	res.status(200).json({ post });
}

// GET /posts  (public list)
export async function getPosts(req, res) {
	const { search, sort, status, authorId, tags } = req.query;

	const posts = await postService.getPosts({
		search,
		sort,
		status,
		authorId: authorId ? Number(authorId) : undefined,
		tags,
	});

	res.status(200).json({ posts });
}

// GET /posts/my  (current user's posts)
export async function getMyPosts(req, res) {
	const authorId = req.user.id;
	const posts = await postService.getMyPosts(authorId);
	res.status(200).json({ posts });
}

// DELETE /posts/:id
export async function deletePost(req, res) {
	await postService.deletePost(req.params.id);
	res.status(204).end();
}

// PUT /posts/:id
export async function updatePost(req, res) {
	const id = req.params.id;
	const post = await postService.updatePost(id, req.body);
	res.status(200).json({ post });
}
