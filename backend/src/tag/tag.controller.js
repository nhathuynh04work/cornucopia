import { tagService } from "./tag.service.js";

const getTags = async (req, res) => {
	const { page, limit, search } = req.query;

	const data = await tagService.getTags({ page, limit, search });
	return res.status(200).json(data);
};

const deleteTag = async (req, res) => {
	await tagService.deleteTag(req.params.id);
	res.status(204).end();
};

export const tagController = {
	getTags,
	deleteTag,
};
