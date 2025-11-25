import { lessonService } from "./lesson.service.js";

const updateLesson = async (req, res) => {
	const id = req.params.id;
	const userId = req.user.id;

	const lesson = await lessonService.update(id, req.body, userId);
	res.status(200).json({ lesson });
};

const updateLessonProgress = async (req, res) => {
	const lessonId = req.params.id;
	const userId = req.user.id;
	const { isCompleted } = req.body;

	const progress = await lessonService.updateLessonProgress({
		lessonId,
		userId,
		isCompleted,
	});

	res.status(200).json({ progress });
};

export const lessonController = {
	updateLesson,
	updateLessonProgress,
};
