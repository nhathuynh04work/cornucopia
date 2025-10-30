import * as moduleService from "../services/module.service.js";

export async function deleteModule(req, res) {
	const id = req.params.id;
	await moduleService.remove(id);

	res.status(204).end();
}
