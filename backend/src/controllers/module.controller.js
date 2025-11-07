import * as moduleService from "../services/module.service.js";

export async function addLesson(req, res) {
	const moduleId = req.params.id;
	const lesson = await moduleService.addLesson(moduleId);

	res.status(201).json({ lesson });
}

export async function updateModule(req, res) {
	const id = req.params.id;
	const userId = req.user.id;

	const module = await moduleService.update(id, req.body, userId);
	res.status(200).json({ module });
}

export async function deleteModule(req, res) {
	const id = req.params.id;
	await moduleService.remove(id);

	res.status(204).end();
}
