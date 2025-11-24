import * as tagService from "../services/tag.service.js";

export async function getTags(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const data = await tagService.getTags({ page, limit });
    return res.status(200).json(data);
}

// DELETE /tags/:id
export async function deleteTag(req, res) {
	await tagService.deleteTag(req.params.id);
	res.status(204).end();
}
