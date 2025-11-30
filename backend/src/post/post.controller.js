import { postService } from "./post.service.js";

const createDefaultPost = async (req, res) => {
	const authorId = req.user.id;
	const post = await postService.createDefaultPost(authorId);
	res.status(201).json({ post });
};

const getPost = async (req, res) => {
	const post = await postService.getPost(req.params.id);
	res.status(200).json({ post });
};

const getPosts = async (req, res) => {
	const { search, sort, status, authorId, tags, page, limit } = req.query;

	const result = await postService.getPosts({
		search,
		sort,
		status,
		authorId,
		tags,
		page,
		limit,
	});

	res.status(200).json(result);
};

const deletePost = async (req, res) => {
	await postService.deletePost(req.params.id);
	res.status(204).end();
};

const updatePost = async (req, res) => {
	const id = req.params.id;
	const post = await postService.updatePost(id, req.body);
	res.status(200).json({ post });
};

export const postController = {
	createDefaultPost,
	getPost,
	getPosts,
	deletePost,
	updatePost,
};
