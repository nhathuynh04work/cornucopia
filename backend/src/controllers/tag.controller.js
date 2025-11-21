import * as tagService from "../services/tag.service.js";

// GET /tags
export async function listTags(_req, res) {
	const tags = await tagService.listTags();
	return res.status(200).json({ tags });
}

// GET /tags/:name
export async function getTagByName(req, res) {
	const tag = await tagService.getTagByName(req.params.name);
	return res.status(200).json({ tag });
}

// GET /tags/:name/posts
export async function listPostsByTagName(req, res) {
	const { page = 1, pageSize = 30 } = req.query;
	const posts = await tagService.listPostsByTagName({
		name: req.params.name,
		offset: (page - 1) * pageSize,
		limit: pageSize,
	});
	return res.status(200).json({ posts });
}

// POST /tags
export async function createTag(req, res) {
	const tag = await tagService.createTag(req.body);
	return res.status(201).json({ tag });
}

// DELETE /tags/:id
export async function deleteTag(req, res) {
	await tagService.deleteTag(req.params.id);
	res.status(204).end();
}
