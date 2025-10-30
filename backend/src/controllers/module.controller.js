import * as moduleService from "../services/module.service.js";

export async function updateModule(req, res) {
	const id = req.params.id;
	const module = await moduleService.update(id, req.body);

	res.status(200).json({ module });
}

export async function deleteModule(req, res) {
	const id = req.params.id;
	await moduleService.remove(id);

	res.status(204).end();
}
