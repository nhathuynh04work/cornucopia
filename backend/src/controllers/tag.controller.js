import * as tagService from "../services/tag.service.js";

// GET /tags
export async function getTags(_req, res) {
	const tags = await tagService.getTags();
	return res.status(200).json({ tags });
}

// DELETE /tags/:id
export async function deleteTag(req, res) {
	await tagService.deleteTag(req.params.id);
	res.status(204).end();
}
