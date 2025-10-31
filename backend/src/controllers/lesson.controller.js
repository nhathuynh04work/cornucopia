import * as lessonService from "../services/lesson.service.js";

export async function updateLesson(req, res) {
	const id = req.params.id;

	const lesson = await lessonService.update(id, req.body);
	res.status(200).json({ lesson });
}
